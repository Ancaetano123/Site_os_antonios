import {loadFont} from '@remotion/google-fonts/Literata';

// Mesma tipografia do site: Literata, um serifado de livro.
const regular = loadFont('normal', {
	weights: ['400', '500', '600'],
	subsets: ['latin', 'latin-ext'],
});
loadFont('italic', {weights: ['400', '500'], subsets: ['latin', 'latin-ext']});

export const fonte = regular.fontFamily;

// Cores tiradas da bandeira (açafrão), do hábito franciscano (burel)
// e das paredes caiadas da ermida (cal).
export const cor = {
	acafrao: '#E0A21B',
	acafraoClaro: '#F2C14E',
	burel: '#2A1E16',
	burelFundo: '#1C140E',
	cal: '#FBF8F2',
	granito: '#B9B2A6',
} as const;

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;
