import React from 'react';
import {Composition, Still} from 'remotion';
import {Filme, FILME_DURACAO} from './Filme';
import {HERO_DURACAO, HeroLoop} from './HeroLoop';
import {Cartaz, Partilha} from './Stills';
import {ALTURA, FPS, LARGURA} from './theme';

export const Root: React.FC = () => (
	<>
		<Composition id="HeroLoop" component={HeroLoop} durationInFrames={HERO_DURACAO} fps={FPS} width={LARGURA} height={ALTURA} />
		<Composition id="Filme" component={Filme} durationInFrames={FILME_DURACAO} fps={FPS} width={LARGURA} height={ALTURA} />
		<Still id="Cartaz" component={Cartaz} width={LARGURA} height={ALTURA} />
		<Still id="Partilha" component={Partilha} width={1200} height={630} />
	</>
);
