"""Preenche sozinho os álbuns automáticos da galeria.

No index.html, um álbum automático está entre duas marcas:

    <!-- ALBUM pasta="galeria/sueca" categoria="sueca" legenda="Torneio de Sueca" -->
    ... (gerado: não editar à mão) ...
    <!-- /ALBUM -->

Este script:
  1. reduz as fotografias muito grandes dessa pasta (máx. 2000 px, para o site
     não ficar lento: as fotos do telemóvel ou do Google Drive têm 4000 px);
  2. cria as miniaturas que faltam (ferramentas/gerar_miniaturas.py);
  3. escreve no index.html uma <figure> por fotografia, por ordem do nome.

Legendas: por omissão, cada fotografia usa a legenda do álbum ("Torneio de
Sueca"). Se o nome do ficheiro for descritivo (ex.: "mesa-final.jpg"), usa-o
("Mesa final"). Para escrever legendas à mão, crie na pasta um ficheiro
legendas.txt com linhas assim:

    mesa-final.jpg = A mesa da final
    IMG_2034.jpg = Os vencedores com a taça

Uso (na pasta do site):
    python ferramentas/actualizar_albuns.py

Requer Pillow:  pip install pillow
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gerar_miniaturas  # noqa: E402

SITE = Path(__file__).resolve().parent.parent
IMAGENS = SITE / "images"
INDEX = SITE / "index.html"
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp"}
LADO_MAX = 2000

MARCA = re.compile(
    r'(?P<abre>[ \t]*<!-- ALBUM (?P<attrs>[^>]*?)-->\n)(?P<corpo>.*?)(?P<fecha>[ \t]*<!-- /ALBUM -->)',
    re.S,
)
ATRIBUTO = re.compile(r'(\w+)="([^"]*)"')
# Nomes que não dizem nada: IMG_2034, DSC0001, PXL_2026..., WhatsApp Image..., 20261108_123456
NOME_DE_CAMARA = re.compile(r"^(img|dsc|dscn|pxl|whatsapp|foto|image|photo|screenshot|captura)?[\W_]*[\d\W_]*$|^(img|dsc|pxl|whatsapp|image)", re.I)


def reduzir(origem: Path) -> None:
    with Image.open(origem) as im:
        if max(im.size) <= LADO_MAX and origem.stat().st_size < 900_000:
            return
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((LADO_MAX, LADO_MAX), Image.Resampling.LANCZOS)
        destino = origem.with_suffix(".jpg") if origem.suffix.lower() in {".png", ".webp"} else origem
        im.save(destino, "JPEG", quality=82, optimize=True, progressive=True)
    if destino != origem:
        origem.unlink()
    print(f"reduzida: {destino.relative_to(SITE)}  {destino.stat().st_size // 1024} KB")


def ler_legendas(pasta: Path) -> dict[str, str]:
    ficheiro = pasta / "legendas.txt"
    if not ficheiro.exists():
        return {}
    legendas = {}
    for linha in ficheiro.read_text(encoding="utf-8").splitlines():
        if "=" in linha and not linha.lstrip().startswith("#"):
            nome, texto = linha.split("=", 1)
            legendas[nome.strip().lower()] = texto.strip()
    return legendas


def legenda_para(foto: Path, legendas: dict[str, str], omissao: str, n: int) -> str:
    if foto.name.lower() in legendas:
        return legendas[foto.name.lower()]
    if NOME_DE_CAMARA.match(foto.stem):
        return f"{omissao} ({n})"
    texto = re.sub(r"[-_]+", " ", foto.stem).strip()
    texto = re.sub(r"\s*\d+$", "", texto) or texto
    return texto[:1].upper() + texto[1:]


def gerar_corpo(attrs: dict[str, str], recuo: str) -> str:
    pasta_rel = attrs["pasta"]
    pasta = IMAGENS / pasta_rel
    categoria = attrs.get("categoria", "momentos")
    omissao = attrs.get("legenda", "Fotografia")
    if not pasta.exists():
        return ""
    fotos = sorted(
        (f for f in pasta.iterdir() if f.suffix.lower() in EXTENSOES),
        key=lambda f: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", f.name)],
    )
    legendas = ler_legendas(pasta)
    linhas = []
    for n, foto in enumerate(fotos, 1):
        mini = IMAGENS / "miniaturas" / foto.relative_to(IMAGENS).with_suffix(".webp")
        with Image.open(mini if mini.exists() else foto) as im:
            largura, altura = im.size
        legenda = html.escape(legenda_para(foto, legendas, omissao, n))
        original = "images/" + foto.relative_to(IMAGENS).as_posix()
        miniatura = "images/" + mini.relative_to(IMAGENS).as_posix() if mini.exists() else original
        linhas.append(
            f'{recuo}<figure class="foto" data-categoria="{categoria}">\n'
            f'{recuo}    <a href="{original}" data-legenda="{legenda}"><img src="{miniatura}" '
            f'width="{largura}" height="{altura}" alt="{legenda}" loading="lazy" decoding="async"></a>\n'
            f"{recuo}</figure>\n"
        )
    return "".join(linhas)


def main() -> None:
    pagina = INDEX.read_text(encoding="utf-8")
    marcas = list(MARCA.finditer(pagina))
    if not marcas:
        print("Não há álbuns automáticos no index.html.")
        return

    for m in marcas:
        pasta = IMAGENS / dict(ATRIBUTO.findall(m["attrs"]))["pasta"]
        pasta.mkdir(parents=True, exist_ok=True)
        for foto in list(pasta.iterdir()):
            if foto.suffix.lower() in EXTENSOES:
                reduzir(foto)

    gerar_miniaturas.main()

    def substituir(m: re.Match) -> str:
        attrs = dict(ATRIBUTO.findall(m["attrs"]))
        recuo = re.match(r"[ \t]*", m["abre"]).group(0)
        corpo = gerar_corpo(attrs, recuo)
        total = corpo.count("<figure")
        print(f'álbum {attrs["pasta"]}: {total} fotografia(s)')
        return m["abre"] + corpo + m["fecha"]

    nova = MARCA.sub(substituir, pagina)
    if nova != pagina:
        INDEX.write_text(nova, encoding="utf-8", newline="\n")
        print("index.html actualizado.")
    else:
        print("index.html já estava em dia.")


if __name__ == "__main__":
    main()
