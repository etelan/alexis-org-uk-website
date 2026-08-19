// Colours visitors can be assigned when they join.
const CURSOR_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
];

export function randomColor() {
	return CURSOR_COLORS[
		Math.floor(Math.random() * CURSOR_COLORS.length)
	];
}