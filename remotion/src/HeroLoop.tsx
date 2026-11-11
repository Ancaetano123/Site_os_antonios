import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Foto} from './components';
import {cor} from './theme';
import fotosSueca from './fotos-sueca.json';

// Fundo do topo do site: planos lentos com fundido, em loop perfeito.
// Sem texto: o título fica no HTML (melhor para leitura e pesquisa).

const PLANO = 150; // 5 s por plano
const FUNDIDO = 30; // 1 s de fundido
const PASSO = PLANO - FUNDIDO;

type Plano = {
	src: string;
	posicao?: string;
	zoom?: [number, number];
	x?: [number, number];
	y?: [number, number];
};

const A46 = 'galeria/aniversarios/46-aniversario/';

// Fotografias recentes (2026): o topo mostra o grupo como está hoje.
const PLANOS: Plano[] = [
	// hero.jpg tem o logótipo à direita: com zoom >= 1.16 a partir da
	// esquerda, só a ermida fica em quadro. O zoom parte do alto (18%)
	// para não cortar a cruz nem o telhado.
	{src: 'hero.jpg', posicao: '0% 18%', zoom: [1.16, 1.24]},
	{src: 'ermida/alpendre-ermida.jpeg', posicao: '50% 60%', zoom: [1.12, 1.02]},
	{src: A46 + 'missa-padre-1.jpeg', posicao: '50% 50%', zoom: [1.03, 1.12], x: [1, -1]},
	{src: A46 + 'jantar-brinde-bandeira.jpeg', posicao: '50% 45%', zoom: [1.12, 1.03]},
	{src: A46 + 'jantar-mesa-1.jpeg', posicao: '50% 50%', zoom: [1.04, 1.14], x: [-1, 1]},
	// Primeira fotografia do Torneio de Sueca, se já existir.
	...(fotosSueca as string[]).slice(0, 1).map((src): Plano => ({src, posicao: '50% 50%', zoom: [1.1, 1.02]})),
	{src: A46 + 'bandeira-historica.jpeg', posicao: '50% 50%', zoom: [1.1, 1.02]},
];

export const HERO_DURACAO = PLANOS.length * PASSO;

const PlanoComFundido: React.FC<{plano: Plano; comFundido: boolean}> = ({plano, comFundido}) => {
	const frame = useCurrentFrame();
	const opacity = comFundido
		? interpolate(frame, [0, FUNDIDO], [0, 1], {extrapolateRight: 'clamp'})
		: 1;
	return (
		<AbsoluteFill style={{opacity}}>
			<Foto src={plano.src} duracao={PLANO} posicao={plano.posicao} zoom={plano.zoom} x={plano.x} y={plano.y} />
		</AbsoluteFill>
	);
};

export const HeroLoop: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			{/* O primeiro plano começa já "a meio" do fundido, para o loop fechar. */}
			<Sequence from={-FUNDIDO} durationInFrames={PLANO}>
				<PlanoComFundido plano={PLANOS[0]} comFundido={false} />
			</Sequence>
			{PLANOS.slice(1).map((plano, i) => (
				<Sequence key={plano.src} from={(i + 1) * PASSO - FUNDIDO} durationInFrames={PLANO}>
					<PlanoComFundido plano={plano} comFundido />
				</Sequence>
			))}
			{/* Regresso ao primeiro plano no fim: fecha o loop sem salto. */}
			<Sequence from={HERO_DURACAO - FUNDIDO} durationInFrames={FUNDIDO}>
				<PlanoComFundido plano={PLANOS[0]} comFundido />
			</Sequence>
		</AbsoluteFill>
	);
};
