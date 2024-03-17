function stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export enum Color {
    Gray = "2;30",
    Red = "2;31",
    Green = "2;32",
    Gold = "2;33",
    Pink = "2;35",
    Blue = "2;34",
    White = "2;37",
    None = "",
}

export const colorize = (text: string | number, color: Color = Color.None): string => {
    if (color === Color.None) return `${text}`;
    return `[${color}m${text}[0m`;
};

export const spacer = (numCols: number) => Array(numCols).fill(" ")

export function buildMarkdownTable(table: string[][]) {

    // Determine the Maximum Visual Length for Each Column
    let maxLengths: number[] = table[0].map((_, colIndex) =>
        Math.max(...table.map(row => stripAnsi(row[colIndex]).length))
    );
    // Correctly Pad Each Item and Format Rows with Additional Space
    let formattedRows: string[] = table.map(row =>
        row.map((item, index) =>
            item + ' '.repeat(maxLengths[index] - stripAnsi(item).length + 8) // Apply padding based on visual length
        ).join("")
    );


    // Step 3: Join All Rows with Newline Character
    let formattedTable: string = formattedRows.join("\n");

    // Display the formatted table
    return `\`\`\`ansi\n${formattedTable}\n\`\`\``
}