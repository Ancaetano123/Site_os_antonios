"""Gera miniaturas WebP leves para a galeria do site.

Cada fotografia em images/<pasta>/foto.jpeg ganha uma miniatura em
images/miniaturas/<pasta>/foto.webp. O site mostra a miniatura na grelha
e abre a fotografia original quando se clica nela.

Uso (na pasta do site):
    python ferramentas/gerar_miniaturas.py

Só cria as miniaturas que faltam ou que estão desactualizadas.
Requer Pillow:  pip install pillow
"""

from pathlib import Path

from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parent.parent
IMAGENS = SITE / "images"
DESTINO = IMAGENS / "miniaturas"
PASTAS = ["historia", "galeria", "ermida", "documentos"]
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp"}
LARGURA_MAX = 760
ALTURA_MAX = 1200
QUALIDADE = 74


def main() -> None:
    novas = 0
    for pasta in PASTAS:
        for origem in sorted((IMAGENS / pasta).rglob("*")):
            if origem.suffix.lower() not in EXTENSOES:
                continue
            destino = DESTINO / origem.relative_to(IMAGENS).with_suffix(".webp")
            if destino.exists() and destino.stat().st_mtime >= origem.stat().st_mtime:
                continue
            destino.parent.mkdir(parents=True, exist_ok=True)
            with Image.open(origem) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                im.thumbnail((LARGURA_MAX, ALTURA_MAX), Image.Resampling.LANCZOS)
                im.save(destino, "WEBP", quality=QUALIDADE, method=6)
            novas += 1
            print(f"{destino.relative_to(SITE)}  {destino.stat().st_size // 1024} KB")
    print(f"{novas} miniatura(s) criada(s).")


if __name__ == "__main__":
    main()
