import { atom } from "jotai";
import { themedColor } from "./utils/themed-color";

export const stageWidthAtom = atom(360);
export const stageHeightAtom = atom(360);
export const stageScrollYAtom = atom(0);

// constants
export const VIEWPORT_PADDING_TOP = 75;
export const PRELOAD_HEIGHT = 75;
export const PADDING_X = 8;
export const DAY_GAP_X = 4;
export const DAY_GAP_Y = 4;
export const MONTH_GAP_Y = 12;
export const DAY_HEIGHT = 40;
export const MONTH_LABEL_HEIGHT = 50;
export const MONTH_LABEL_PADDING_TOP = 10;
export const DIVIDER_WIDTH = 0.5;
export const DIVIDER_COLOR = themedColor("rgba(100, 100, 100, 0.2)");
export const DAY_TEXT_COLOR = themedColor("#111", "#ccc");
export const DAY_ACTIVE_TEXT_COLOR = themedColor("white");
export const DAY_ACTIVE_BG = themedColor("#e33");
export const MONTH_TEXT_COLOR = themedColor("#111", "#ccc");
export const MONTH_ACTIVE_TEXT_COLOR = themedColor("#111");
