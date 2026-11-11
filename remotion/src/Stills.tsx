import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Sombra} from './components';
import {cor, fonte} from './theme';

const foto = (src: string, posicao = '50% 50%'): React.CSSProperties => ({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	objectPosition: posicao,
	filter: 'saturate(0.92) contrast(1.04)',
});

/** Imagem de partilha (Facebook, WhatsApp): 1200 x 630. */
export const Partilha: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: cor.acafrao, flexDirection: 'row'}}>
		<div style={{width: 640, height: '100%'}}>
			<Img src={staticFile('historia/bandeira-jantar.jpeg')} style={foto('50% 50%')} />
		</div>
		<div style={{flex: 1, padding: '0 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: fonte, color: cor.burel}}>
			<Img src={staticFile('logo.png')} style={{width: 112, height: 112, borderRadius: '50%', backgroundColor: '#fff', marginBottom: 36}} />
			<div style={{fontSize: 74, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em'}}>Os Antónios</div>
			<div style={{width: 120, height: 5, backgroundColor: cor.burel, margin: '28px 0 24px'}} />
			<div style={{fontSize: 30, lineHeight: 1.35}}>Grupo de Celorico da Beira, unido por Santo António desde 1980.</div>
		</div>
	</AbsoluteFill>
);

/** Cartaz do filme (antes de carregar no play): 1920 x 1080. */
export const Cartaz: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
		<Img src={staticFile('galeria/aniversarios/46-aniversario/jantar-brinde-bandeira.jpeg')} style={foto('50% 45%')} />
		<Sombra direcao="esquerda" forca={0.92} />
		<AbsoluteFill style={{padding: '0 140px 150px', justifyContent: 'flex-end', fontFamily: fonte, color: cor.cal}}>
			<div style={{fontSize: 50, fontStyle: 'italic', color: cor.acafraoClaro, marginBottom: 24}}>De 1980 até hoje</div>
			<div style={{fontSize: 150, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em'}}>Os Antónios</div>
			<div style={{width: 180, height: 6, backgroundColor: cor.acafrao, margin: '40px 0 34px'}} />
			<div style={{fontSize: 50, color: cor.cal}}>46 anos, e a crescer</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
