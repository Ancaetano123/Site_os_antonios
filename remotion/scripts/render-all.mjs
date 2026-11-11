// Renderiza os vídeos e imagens do site e comprime-os para a web.
//
//   npm run render              -> tudo
//   npm run render -- hero      -> só o fundo do topo
//   npm run render -- filme     -> só o filme
//   npm run render -- imagens   -> só cartazes e imagem de partilha
//
// Precisa de ffmpeg no PATH.

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname, extname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(raiz, '..');
const out = join(raiz, 'out');
const media = join(site, 'media');
mkdirSync(out, {recursive: true});
mkdirSync(media, {recursive: true});

// Fotografias do Torneio de Sueca: o filme e o fundo do topo usam as que
// estiverem em images/galeria/sueca/ (por ordem alfabética do nome).
const pastaSueca = join(site, 'images', 'galeria', 'sueca');
const fotosSueca = existsSync(pastaSueca)
	? readdirSync(pastaSueca)
			.filter((f) => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()))
			.sort((a, b) => a.localeCompare(b, 'pt', {numeric: true}))
			.map((f) => `galeria/sueca/${f}`)
	: [];
writeFileSync(join(raiz, 'src', 'fotos-sueca.json'), JSON.stringify(fotosSueca, null, '\t') + '\n');
console.log(`Fotografias da Sueca encontradas: ${fotosSueca.length}`);

const cli = join(raiz, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const pedidos = process.argv.slice(2);
const quer = (nome) => pedidos.length === 0 || pedidos.includes(nome);

function correr(cmd, args) {
	console.log(`\n> ${cmd === process.execPath ? 'remotion' : cmd} ${args.join(' ')}`);
	const r = spawnSync(cmd, args, {cwd: raiz, stdio: 'inherit'});
	if (r.status !== 0) {
		console.error(`Falhou (código ${r.status}).`);
		process.exit(r.status ?? 1);
	}
}
const remotion = (...args) => correr(process.execPath, [cli, ...args]);
const ffmpeg = (...args) => correr('ffmpeg', ['-v', 'error', '-y', ...args]);
const tamanho = (f) => `${(statSync(f).size / 1024 / 1024).toFixed(1)} MB`;

// Codificação para a web: H.264, sem som, com "faststart" para começar logo a tocar.
const web = (entrada, saida, largura, crf) =>
	ffmpeg('-i', entrada, '-vf', `scale=${largura}:-2:flags=lanczos`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', saida);

if (quer('hero')) {
	const bruto = join(out, 'hero-loop.mp4');
	remotion('render', 'src/index.ts', 'HeroLoop', bruto, '--crf=14', '--muted');
	web(bruto, join(media, 'hero-loop.mp4'), 1920, 31);
	remotion('still', 'src/index.ts', 'HeroLoop', join(out, 'hero-cartaz.png'), '--frame=0');
	ffmpeg('-i', join(out, 'hero-cartaz.png'), '-vf', 'scale=1600:-2', '-q:v', '4', join(media, 'hero-cartaz.jpg'));
	// Telemóveis: vídeo e cartaz ao alto (9:16)
	const brutoVertical = join(out, 'hero-loop-vertical.mp4');
	remotion('render', 'src/index.ts', 'HeroLoopVertical', brutoVertical, '--crf=16', '--muted');
	web(brutoVertical, join(media, 'hero-loop-movel.mp4'), 720, 30);
	remotion('still', 'src/index.ts', 'HeroLoopVertical', join(out, 'hero-cartaz-movel.png'), '--frame=0');
	ffmpeg('-i', join(out, 'hero-cartaz-movel.png'), '-vf', 'scale=720:-2', '-q:v', '4', join(media, 'hero-cartaz-movel.jpg'));
	console.log(`hero-loop.mp4 ${tamanho(join(media, 'hero-loop.mp4'))}, móvel ${tamanho(join(media, 'hero-loop-movel.mp4'))}`);
}

if (quer('filme')) {
	const bruto = join(out, 'filme.mp4');
	remotion('render', 'src/index.ts', 'Filme', bruto, '--crf=14', '--muted');
	web(bruto, join(media, 'filme-os-antonios.mp4'), 1920, 26);
	console.log(`filme-os-antonios.mp4 ${tamanho(join(media, 'filme-os-antonios.mp4'))}`);
}

if (quer('imagens')) {
	remotion('still', 'src/index.ts', 'Cartaz', join(out, 'filme-cartaz.png'));
	ffmpeg('-i', join(out, 'filme-cartaz.png'), '-vf', 'scale=1600:-2', '-q:v', '3', join(media, 'filme-cartaz.jpg'));
	remotion('still', 'src/index.ts', 'Partilha', join(out, 'partilha.png'));
	ffmpeg('-i', join(out, 'partilha.png'), '-q:v', '3', join(site, 'images', 'partilha.jpg'));
}

console.log('\nFeito.');
