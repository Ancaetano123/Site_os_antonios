import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {cor, fonte} from './theme';

// Ligeira unificação de cor: as fotos vêm de telemóveis diferentes.
const GRADE = 'saturate(0.92) contrast(1.04) brightness(0.98)';

type FotoProps = {
	src: string;
	/** Duração do movimento em frames (normalmente a duração do plano). */
	duracao: number;
	zoom?: [number, number];
	/** Deslocação em % da largura/altura, de -> para. */
	x?: [number, number];
	y?: [number, number];
	posicao?: string;
	style?: React.CSSProperties;
};

/** Fotografia com movimento lento de câmara (efeito Ken Burns). */
export const Foto: React.FC<FotoProps> = ({
	src,
	duracao,
	zoom = [1.04, 1.14],
	x = [0, 0],
	y = [0, 0],
	posicao = '50% 50%',
	style,
}) => {
	const frame = useCurrentFrame();
	const p = frame / duracao;
	const s = zoom[0] + (zoom[1] - zoom[0]) * p;
	const tx = x[0] + (x[1] - x[0]) * p;
	const ty = y[0] + (y[1] - y[0]) * p;
	return (
		<AbsoluteFill style={{overflow: 'hidden', ...style}}>
			<Img
				src={staticFile(src)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					objectPosition: posicao,
					transform: `translate(${tx}%, ${ty}%) scale(${s})`,
					transformOrigin: posicao,
					filter: GRADE,
				}}
			/>
		</AbsoluteFill>
	);
};

/** Moldura de foto estática (sem movimento próprio), para colagens. */
export const Moldura: React.FC<{
	src: string;
	largura: number;
	altura: number;
	posicao?: string;
	style?: React.CSSProperties;
}> = ({src, largura, altura, posicao = '50% 50%', style}) => (
	<div
		style={{
			width: largura,
			height: altura,
			overflow: 'hidden',
			boxShadow: '0 30px 80px rgba(0,0,0,.45)',
			backgroundColor: cor.burel,
			...style,
		}}
	>
		<Img
			src={staticFile(src)}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				objectPosition: posicao,
				filter: GRADE,
			}}
		/>
	</div>
);

/** Linha de texto que sobe de dentro de uma máscara. */
export const Linha: React.FC<{
	children: React.ReactNode;
	atraso?: number;
	style?: React.CSSProperties;
}> = ({children, atraso = 0, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({
		frame: frame - atraso,
		fps,
		config: {damping: 200, mass: 0.9},
		durationInFrames: 28,
	});
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.08em'}}>
			<div
				style={{
					fontFamily: fonte,
					whiteSpace: 'nowrap',
					transform: `translateY(${(1 - p) * 105}%)`,
					opacity: interpolate(p, [0, 0.4], [0, 1]),
					...style,
				}}
			>
				{children}
			</div>
		</div>
	);
};

/** Régua açafrão que se desenha da esquerda para a direita. */
export const Regua: React.FC<{
	atraso?: number;
	largura?: number;
	espessura?: number;
	cor?: string;
	style?: React.CSSProperties;
}> = ({atraso = 0, largura = 160, espessura = 6, cor: c = cor.acafrao, style}) => {
	const frame = useCurrentFrame();
	const w = interpolate(frame - atraso, [0, 24], [0, largura], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	return <div style={{width: w, height: espessura, backgroundColor: c, ...style}} />;
};

/** Gradiente escuro para dar leitura ao texto sobre fotografia. */
export const Sombra: React.FC<{direcao?: 'esquerda' | 'baixo'; forca?: number}> = ({
	direcao = 'esquerda',
	forca = 0.88,
}) => (
	<AbsoluteFill
		style={{
			background:
				direcao === 'esquerda'
					? `linear-gradient(90deg, rgba(28,20,14,${forca}) 0%, rgba(28,20,14,${forca * 0.55}) 42%, rgba(28,20,14,0) 72%)`
					: `linear-gradient(0deg, rgba(28,20,14,${forca}) 0%, rgba(28,20,14,${forca * 0.5}) 35%, rgba(28,20,14,0) 62%)`,
		}}
	/>
);

/** Entrada com mola: devolve 0 -> 1. */
export const useEntrada = (atraso = 0, duracao = 30) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - atraso, fps, config: {damping: 200}, durationInFrames: duracao});
};
