import {Config} from '@remotion/cli/config';

// As fotografias vêm directamente da pasta images/ do site,
// por isso não há cópias duplicadas dentro deste projecto.
Config.setPublicDir('../images');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
