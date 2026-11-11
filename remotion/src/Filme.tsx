import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Foto, Linha, Regua, Sombra, useEntrada} from './components';
import {cor, fonte} from './theme';
import fotosSueca from './fotos-sueca.json';

// "Os Antónios — de 1980 até hoje".
// Pouco passado (a origem e 2003) e muito presente: a ermida, o 46.º aniversário,
// a bandeira restaurada, o Torneio de Sueca e o que aí vem.
//
// As fotografias da Sueca entram sozinhas: o script de render lê a pasta
// images/galeria/sueca/ e escreve a lista em src/fotos-sueca.json.

const A46 = 'galeria/aniversarios/46-aniversario/';
const TRANSICAO = 20;
const SUECA: string[] = (fotosSueca as string[]).slice(0, 7);

const texto: React.CSSProperties = {fontFamily: fonte, color: cor.cal};

/* ---------- 1. Abertura ---------- */
const Abertura: React.FC = () => {
	const logo = useEntrada(4, 34);
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo, alignItems: 'center', justifyContent: 'center'}}>
			<Img
				src={staticFile('logo.png')}
				style={{
					width: 210,
					height: 210,
					borderRadius: '50%',
					backgroundColor: '#fff',
					opacity: logo,
					transform: `scale(${0.9 + logo * 0.1})`,
					marginBottom: 52,
				}}
			/>
			<Linha atraso={18} style={{...texto, fontSize: 150, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1}}>
				Os Antónios
			</Linha>
			<Regua atraso={36} largura={180} style={{margin: '36px 0 32px'}} />
			<Linha atraso={44} style={{...texto, fontSize: 46, fontStyle: 'italic', color: cor.acafraoClaro}}>
				De 1980 até hoje
			</Linha>
		</AbsoluteFill>
	);
};

/* ---------- 2. Raízes: 1980 (o único momento "antigo" com fotografia) ---------- */
const Origem: React.FC<{duracao: number}> = ({duracao}) => (
	<AbsoluteFill>
		{/* hero.jpg tem o logótipo à direita: o zoom mínimo de 1.16 deixa-o fora de quadro. */}
		<Foto src="hero.jpg" duracao={duracao} posicao="0% 45%" zoom={[1.16, 1.26]} />
		<Sombra direcao="esquerda" />
		<AbsoluteFill style={{padding: '0 140px 150px', justifyContent: 'flex-end'}}>
			<Linha atraso={8} style={{...texto, fontSize: 210, fontWeight: 600, color: cor.acafrao, lineHeight: 0.95, fontVariantNumeric: 'lining-nums'}}>
				1980
			</Linha>
			<div style={{height: 30}} />
			<Linha atraso={24} style={{...texto, fontSize: 50, lineHeight: 1.25}}>
				Na festa de Santo António do Rio,
			</Linha>
			<Linha atraso={30} style={{...texto, fontSize: 50, lineHeight: 1.25}}>
				um pequeno grupo de Antónios janta junto.
			</Linha>
		</AbsoluteFill>
	</AbsoluteFill>
);

/* ---------- 3. 2003: reconhecimento oficial ---------- */
const Oficial: React.FC = () => {
	const docs = [
		{src: 'documentos/diario-republica-capa.jpeg', rot: -7, x: 0, y: 40, atraso: 4},
		{src: 'documentos/certidao-notarial.jpeg', rot: 4, x: 290, y: 0, atraso: 12},
		{src: 'documentos/diario-republica-publicacao.jpeg', rot: -2, x: 560, y: 70, atraso: 20},
	];
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			<div style={{position: 'absolute', left: 110, top: 150, width: 980, height: 800}}>
				{docs.map((d) => (
					<Documento key={d.src} {...d} />
				))}
			</div>
			<AbsoluteFill style={{left: 1110, width: 810, padding: '0 120px 0 40px', justifyContent: 'center'}}>
				<Linha atraso={10} style={{...texto, fontSize: 200, fontWeight: 600, color: cor.acafrao, lineHeight: 0.95}}>
					2003
				</Linha>
				<div style={{height: 36}} />
				{['O grupo passa a ser oficial:', 'escritura pública e', 'Diário da República.'].map((l, i) => (
					<Linha key={l} atraso={24 + i * 6} style={{...texto, fontSize: 44, lineHeight: 1.3}}>
						{l}
					</Linha>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Documento: React.FC<{src: string; rot: number; x: number; y: number; atraso: number}> = ({src, rot, x, y, atraso}) => {
	const e = useEntrada(atraso, 30);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				opacity: interpolate(e, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
				transform: `translateY(${(1 - e) * -120}px) rotate(${rot * e + (1 - e) * rot * 2.2}deg)`,
				padding: 12,
				backgroundColor: '#fff',
				boxShadow: '0 40px 90px rgba(0,0,0,.55)',
			}}
		>
			<Img src={staticFile(src)} style={{width: 410, height: 553, objectFit: 'cover', objectPosition: 'top center', display: 'block'}} />
		</div>
	);
};

/* ---------- 4. Ponte para o presente ---------- */
const Hoje: React.FC<{duracao: number}> = ({duracao}) => (
	<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
		<AbsoluteFill style={{opacity: 0.38}}>
			<Foto src={A46 + 'jantar-mesa-1.jpeg'} duracao={duracao} zoom={[1.08, 1.0]} />
		</AbsoluteFill>
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(28,20,14,.35) 0%, rgba(28,20,14,.85) 75%)'}} />
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
			<Linha atraso={6} style={{...texto, fontSize: 64, fontStyle: 'italic', color: cor.acafraoClaro}}>
				E hoje?
			</Linha>
			<div style={{height: 26}} />
			<Linha atraso={20} style={{...texto, fontSize: 104, fontWeight: 500, lineHeight: 1.08}}>
				O grupo está mais vivo
			</Linha>
			<Linha atraso={28} style={{...texto, fontSize: 104, fontWeight: 500, lineHeight: 1.08}}>
				do que nunca.
			</Linha>
		</AbsoluteFill>
	</AbsoluteFill>
);

/* ---------- 5. A crescer: de um punhado a cerca de 85 ---------- */
const Crescer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - 18, fps, config: {damping: 200}, durationInFrames: 90});
	const numero = Math.round(interpolate(p, [0, 1], [5, 85]));
	const etapas = [
		{ano: '1980', txt: 'um jantar', atraso: 30},
		{ano: '2003', txt: 'grupo oficial', atraso: 52},
		{ano: '2026', txt: 'cerca de 85 sócios', atraso: 74},
	];
	const barra = interpolate(frame, [28, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: cor.acafrao, color: cor.burel, padding: '0 140px', justifyContent: 'center'}}>
			<div style={{display: 'flex', alignItems: 'flex-end', gap: 48}}>
				<div style={{fontFamily: fonte, fontSize: 360, fontWeight: 600, lineHeight: 0.8, letterSpacing: '-0.04em', fontVariantNumeric: 'lining-nums tabular-nums', minWidth: 470}}>
					{numero}
				</div>
				<div style={{paddingBottom: 18}}>
					<Linha atraso={10} style={{fontFamily: fonte, fontSize: 86, fontWeight: 500, color: cor.burel, lineHeight: 1}}>
						Antónios
					</Linha>
					<Linha atraso={20} style={{fontFamily: fonte, fontSize: 40, fontStyle: 'italic', color: cor.burel, marginTop: 14}}>
						e a porta continua aberta.
					</Linha>
				</div>
			</div>
			<div style={{position: 'relative', marginTop: 110, height: 6, backgroundColor: 'rgba(42,30,22,.2)'}}>
				<div style={{position: 'absolute', inset: 0, width: `${barra * 100}%`, backgroundColor: cor.burel}} />
			</div>
			<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 26}}>
				{etapas.map((e) => {
					const v = entradaLocal(frame, e.atraso);
					return (
						<div key={e.ano} style={{fontFamily: fonte, opacity: v, transform: `translateY(${(1 - v) * 24}px)`}}>
							<div style={{fontSize: 54, fontWeight: 600, fontVariantNumeric: 'lining-nums'}}>{e.ano}</div>
							<div style={{fontSize: 34}}>{e.txt}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const entradaLocal = (frame: number, atraso: number) =>
	interpolate(frame, [atraso, atraso + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/* ---------- 6. A ermida, hoje ---------- */
const Ermida: React.FC<{duracao: number}> = ({duracao}) => (
	<AbsoluteFill>
		<Foto src="ermida/alpendre-ermida.jpeg" duracao={duracao} posicao="50% 60%" zoom={[1.14, 1.02]} />
		<Sombra direcao="baixo" forca={0.9} />
		<AbsoluteFill style={{padding: '0 140px 120px', justifyContent: 'flex-end'}}>
			<Linha atraso={10} style={{...texto, fontSize: 92, fontWeight: 500, lineHeight: 1.05}}>
				A ermida continua a ser a nossa casa.
			</Linha>
			<div style={{height: 20}} />
			<Linha atraso={22} style={{...texto, fontSize: 40, fontStyle: 'italic', color: cor.acafraoClaro}}>
				Capela de Santo António do Rio, junto ao Mondego
			</Linha>
		</AbsoluteFill>
	</AbsoluteFill>
);

/* ---------- 7. 46.º aniversário ---------- */
const Triptico: React.FC<{fotos: string[]; duracao: number}> = ({fotos, duracao}) => (
	<AbsoluteFill style={{flexDirection: 'row', gap: 12, backgroundColor: cor.burelFundo}}>
		{fotos.map((f, i) => (
			<div key={f} style={{flex: 1, position: 'relative'}}>
				<Foto src={f} duracao={duracao} zoom={i % 2 ? [1.12, 1.03] : [1.03, 1.12]} posicao="50% 50%" />
			</div>
		))}
	</AbsoluteFill>
);

const Cruzado: React.FC<{children: React.ReactNode}> = ({children}) => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{opacity: interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};

const Aniversario: React.FC = () => {
	const P = 110;
	const frame = useCurrentFrame();
	const tituloSai = interpolate(frame, [92, 112], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const planos: React.ReactNode[] = [
		<Triptico key="a" fotos={[A46 + 'missa-geral.jpeg', A46 + 'altar-ermida.jpeg', A46 + 'missa-padre-2.jpeg']} duracao={P} />,
		<Foto key="b" src={A46 + 'jantar-brinde-bandeira.jpeg'} duracao={P} zoom={[1.04, 1.14]} />,
		<Triptico key="c" fotos={[A46 + 'jantar-mesa-2.jpeg', A46 + 'jantar-discurso.jpeg', A46 + 'jantar-programa.jpeg']} duracao={P} />,
		<Foto key="d" src={A46 + 'jantar-mesa-3.jpeg'} duracao={P} zoom={[1.12, 1.02]} x={[1, -1]} />,
		<Triptico key="e" fotos={[A46 + 'bolo-46-aniversario.jpeg', A46 + 'missa-padre-1.jpeg', A46 + 'champanhe.jpeg']} duracao={P} />,
	];
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			{planos.map((plano, i) => (
				<Sequence key={i} from={i * P} durationInFrames={P + 12}>
					{i === 0 ? plano : <Cruzado>{plano}</Cruzado>}
				</Sequence>
			))}
			<Sombra direcao="baixo" forca={0.8} />
			{/* Título grande no início; depois fica só a legenda discreta. */}
			<AbsoluteFill style={{padding: '0 140px 120px', justifyContent: 'flex-end', opacity: tituloSai}}>
				<Linha atraso={8} style={{...texto, fontSize: 120, fontWeight: 600, lineHeight: 1, color: cor.acafrao}}>
					46.º aniversário
				</Linha>
				<div style={{height: 24}} />
				<Linha atraso={20} style={{...texto, fontSize: 46}}>
					13 de junho de 2026: missa na ermida e jantar
				</Linha>
			</AbsoluteFill>
			<AbsoluteFill style={{padding: '0 140px 70px', justifyContent: 'flex-end', opacity: 1 - tituloSai}}>
				<div style={{...texto, fontSize: 34}}>
					<span style={{color: cor.acafrao}}>46.º aniversário</span>, 13 de junho de 2026
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
const ANIVERSARIO_DURACAO = 110 * 5;

/* ---------- 8. A bandeira, restaurada ---------- */
const Bandeira: React.FC<{duracao: number}> = ({duracao}) => (
	<AbsoluteFill style={{backgroundColor: cor.acafrao}}>
		<AbsoluteFill style={{left: 1060, width: 860}}>
			<Foto src="bandeira.jpg" duracao={duracao} posicao="50% 36%" zoom={[1.02, 1.1]} />
		</AbsoluteFill>
		<AbsoluteFill style={{width: 1060, padding: '0 100px 0 140px', justifyContent: 'center'}}>
			<Linha atraso={8} style={{fontFamily: fonte, fontSize: 104, fontWeight: 600, color: cor.burel, lineHeight: 1, letterSpacing: '-0.02em'}}>
				A bandeira
			</Linha>
			<Linha atraso={16} style={{fontFamily: fonte, fontSize: 104, fontWeight: 500, fontStyle: 'italic', color: cor.burel, lineHeight: 1.05}}>
				restaurada
			</Linha>
			<Regua atraso={28} cor={cor.burel} style={{margin: '40px 0 34px'}} />
			<Linha atraso={34} style={{fontFamily: fonte, fontSize: 40, color: cor.burel, lineHeight: 1.35}}>
				Recuperou as cores de origem
			</Linha>
			<Linha atraso={40} style={{fontFamily: fonte, fontSize: 40, color: cor.burel, lineHeight: 1.35}}>
				e continua a ir a todo o lado.
			</Linha>
		</AbsoluteFill>
	</AbsoluteFill>
);

/* ---------- 9. Na televisão e na imprensa ---------- */
const Media: React.FC = () => {
	const rtp = useEntrada(6, 32);
	const mag = useEntrada(18, 32);
	const moldura = (src: string, w: number, h: number, pos: string) => (
		<div style={{width: w, height: h, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.45)'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
		</div>
	);
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			<AbsoluteFill style={{padding: '110px 140px 0'}}>
				<Linha atraso={0} style={{...texto, fontSize: 70, fontWeight: 500}}>
					Falam de nós
				</Linha>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 140, top: 300, opacity: rtp, transform: `translateX(${(1 - rtp) * -80}px)`}}>
				{moldura('documentos/rtp-praca-alegria.png', 900, 502, '50% 50%')}
				<div style={{...texto, fontSize: 34, marginTop: 26}}>Praça da Alegria, RTP 1</div>
			</div>
			<div style={{position: 'absolute', left: 1090, top: 400, opacity: mag, transform: `translateX(${(1 - mag) * 80}px)`}}>
				{moldura('documentos/magazine-serrano.png', 690, 440, '0% 0%')}
				<div style={{...texto, fontSize: 34, marginTop: 26}}>Magazine Serrano</div>
			</div>
		</AbsoluteFill>
	);
};

/* ---------- 10. Torneio de Sueca (só aparece se houver fotografias) ---------- */
const Sueca: React.FC<{duracao: number}> = ({duracao}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const capa = SUECA[0];
	const resto = SUECA.slice(1, 7);
	const ABRE = 120;
	const grelhaEntra = interpolate(frame, [ABRE - 10, ABRE + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const colunas = resto.length <= 2 ? resto.length : 3;
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			<Sequence durationInFrames={resto.length ? ABRE + 10 : duracao}>
				<Foto src={capa} duracao={resto.length ? ABRE : duracao} zoom={[1.04, 1.14]} />
				<Sombra direcao="esquerda" forca={0.9} />
				<AbsoluteFill style={{padding: '0 140px 140px', justifyContent: 'flex-end'}}>
					<Naipes atraso={4} />
					<div style={{height: 26}} />
					<Linha atraso={10} style={{...texto, fontSize: 40, fontStyle: 'italic', color: cor.acafraoClaro}}>
						Convívio entre Antónios
					</Linha>
					<div style={{height: 10}} />
					<Linha atraso={18} style={{...texto, fontSize: 140, fontWeight: 600, lineHeight: 1}}>
						Torneio de Sueca
					</Linha>
				</AbsoluteFill>
			</Sequence>
			{resto.length > 0 && (
				<AbsoluteFill style={{opacity: grelhaEntra, padding: 60, display: 'grid', gap: 18, gridTemplateColumns: `repeat(${colunas}, 1fr)`}}>
					{resto.map((f, i) => {
						const e = spring({frame: frame - ABRE - i * 6, fps, config: {damping: 18, mass: 0.7}, durationInFrames: 34});
						return (
							<div key={f} style={{position: 'relative', overflow: 'hidden', transform: `scale(${0.86 + e * 0.14})`, opacity: Math.min(1, e * 1.4), boxShadow: '0 24px 60px rgba(0,0,0,.5)'}}>
								<Sequence from={ABRE}>
									<Foto src={f} duracao={duracao - ABRE} zoom={i % 2 ? [1.12, 1.02] : [1.02, 1.12]} />
								</Sequence>
							</div>
						);
					})}
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

/** Os quatro naipes do baralho, a entrar um a um. */
const Naipes: React.FC<{atraso: number}> = ({atraso}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 22, fontSize: 64, lineHeight: 1}}>
			{['♠', '♥', '♣', '♦'].map((n, i) => {
				const v = interpolate(frame, [atraso + i * 5, atraso + i * 5 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<span key={n} style={{color: i % 2 ? cor.acafrao : cor.cal, opacity: v, transform: `translateY(${(1 - v) * 30}px)`, display: 'inline-block'}}>
						{n}
					</span>
				);
			})}
		</div>
	);
};

/* ---------- 11. O que vem aí ---------- */
const Futuro: React.FC<{duracao: number}> = ({duracao}) => (
	<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
		<AbsoluteFill style={{left: 1020, width: 900}}>
			<Foto src="ermida/azulejo-santo-antonio-do-rio.jpeg" duracao={duracao} posicao="50% 40%" zoom={[1.12, 1.0]} />
		</AbsoluteFill>
		<AbsoluteFill style={{width: 1020, padding: '0 100px 0 140px', justifyContent: 'center'}}>
			<Linha atraso={6} style={{...texto, fontSize: 44, fontStyle: 'italic', color: cor.acafraoClaro}}>
				O que vem aí
			</Linha>
			<div style={{height: 22}} />
			{['Trazer de volta a festa', 'de Santo António do Rio.'].map((l, i) => (
				<Linha key={l} atraso={14 + i * 7} style={{...texto, fontSize: 64, fontWeight: 500, lineHeight: 1.14}}>
					{l}
				</Linha>
			))}
			<Regua atraso={40} style={{margin: '44px 0 30px'}} />
			<Linha atraso={48} style={{...texto, fontSize: 38, color: cor.granito, lineHeight: 1.35}}>
				E receber cada vez mais Antónios.
			</Linha>
		</AbsoluteFill>
	</AbsoluteFill>
);

/* ---------- 12. Fecho ---------- */
const Fecho: React.FC<{duracao: number}> = ({duracao}) => {
	const frame = useCurrentFrame();
	const negro = interpolate(frame, [duracao - 24, duracao], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const logo = useEntrada(84, 30);
	return (
		<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
			<AbsoluteFill style={{opacity: 0.34}}>
				<Foto src={A46 + 'brinde-final.jpeg'} duracao={duracao} zoom={[1.02, 1.1]} />
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<Linha atraso={8} style={{...texto, fontSize: 92, fontWeight: 500, lineHeight: 1.1}}>
					Cerca de 85 Antónios.
				</Linha>
				<Linha atraso={26} style={{...texto, fontSize: 92, fontWeight: 500, lineHeight: 1.1, color: cor.acafrao}}>
					Uma só bandeira.
				</Linha>
				<Regua atraso={60} largura={180} style={{margin: '54px 0 40px'}} />
				<Linha atraso={68} style={{...texto, fontSize: 48, fontStyle: 'italic'}}>
					Até 13 de junho de 2027.
				</Linha>
				<Img
					src={staticFile('logo.png')}
					style={{width: 120, height: 120, borderRadius: '50%', backgroundColor: '#fff', marginTop: 60, opacity: logo}}
				/>
			</AbsoluteFill>
			<AbsoluteFill style={{backgroundColor: '#000', opacity: negro}} />
		</AbsoluteFill>
	);
};

/* ---------- Montagem ---------- */
type Cena = {d: number; el: (d: number) => React.ReactNode};

const CENAS: Cena[] = [
	{d: 120, el: () => <Abertura />},
	// Passado, em pouco tempo
	{d: 200, el: (d) => <Origem duracao={d} />},
	{d: 180, el: () => <Oficial />},
	// Presente
	{d: 150, el: (d) => <Hoje duracao={d} />},
	{d: 210, el: () => <Crescer />},
	{d: 180, el: (d) => <Ermida duracao={d} />},
	{d: ANIVERSARIO_DURACAO, el: () => <Aniversario />},
	{d: 190, el: (d) => <Bandeira duracao={d} />},
	...(SUECA.length > 0 ? [{d: SUECA.length > 1 ? 330 : 180, el: (d: number) => <Sueca duracao={d} />}] : []),
	{d: 170, el: () => <Media />},
	// Futuro
	{d: 210, el: (d) => <Futuro duracao={d} />},
	{d: 240, el: (d) => <Fecho duracao={d} />},
];

export const FILME_DURACAO = CENAS.reduce((t, c) => t + c.d, 0) - TRANSICAO * (CENAS.length - 1);

export const Filme: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: cor.burelFundo}}>
		<TransitionSeries>
			{CENAS.flatMap((c, i) => {
				const seq = (
					<TransitionSeries.Sequence key={`s${i}`} durationInFrames={c.d}>
						{c.el(c.d)}
					</TransitionSeries.Sequence>
				);
				return i === 0
					? [seq]
					: [
							<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({durationInFrames: TRANSICAO})} />,
							seq,
						];
			})}
		</TransitionSeries>
	</AbsoluteFill>
);
