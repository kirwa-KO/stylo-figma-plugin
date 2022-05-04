// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).
// Runs this code if the plugin is run in Figma

const createdStyles = [];

let count = 0;

run().then (() => {
	figma.closePlugin();
	console.log(`${count} styles created`);
});

function printTextNode(textNode) {
	console.log(`characters => ${textNode.characters}`);
	console.log(`fontSize => ${textNode.fontSize}`);
	console.log(`fontName family => ${textNode.fontName.family} | style => ${textNode.fontName.style}`);
	console.log(`letterSpacing value => ${textNode.letterSpacing.value} | unit => ${textNode.letterSpacing.unit}`);
	console.log(`lineHeight value => ${textNode.lineHeight.value} | unit => ${textNode.lineHeight.unit}`);
	console.log(`textStyleId => |${textNode.textStyleId}| {<==>} |${textNode.textStyleId === ""}|`);
}


async function run () {
	if (figma.editorType === "figma") {
		const textNodes = figma.root.findAll((node) => node.type === "TEXT");
		
		for (let i = 0; i < textNodes.length; i++) {
			console.log("textNode => " + i);
			if (textNodes[i].textStyleId.length > 0)
				continue ;
	
			let isStyleCreated = false;
			// check if the text style is already created
			for (let j = 0; j < createdStyles.length; j++) {
				console.log("Cheking..!!!");
				if (
					textNodes[i].fontName.family === createdStyles[j].fontNameFamily			&&
					textNodes[i].fontName.style === createdStyles[j].fontNameStyle 				&&
					textNodes[i].fontSize === createdStyles[j].fontSize							&&
					textNodes[i].letterSpacing.value === createdStyles[j].letterSpacingValue	&&
					textNodes[i].letterSpacing.unit === createdStyles[j].letterSpacingUnit		&&
					textNodes[i].lineHeight.value === createdStyles[j].lineHeightValue			&&
					textNodes[i].lineHeight.unit === createdStyles[j].lineHeightUnit
				) {
					isStyleCreated = true;
					textNodes[i].textStyleId = createdStyles[j].id;
					console.log("style already created");
					break;
				}
			}
	
			if (isStyleCreated == false) {
				try {
					await createNewTextStyle(textNodes[i]);
					count += 1;
					console.log("Error: Outside createNewTextStyle => " + err);
				}
				catch (err) {
					console.log(err);
				}
			}
		}
	}
}

async function createNewTextStyle(textNode) {
	try {
		await figma.loadFontAsync(textNode.fontName)
		const newStyle = figma.createTextStyle();
		newStyle.fontName = textNode.fontName;
		newStyle.fontSize = textNode.fontSize;
		newStyle.letterSpacing = textNode.letterSpacing;
		newStyle.lineHeight = textNode.lineHeight;
		newStyle.lineHeight = textNode.lineHeight;
		newStyle.name = textNode.fontName.family + "_" + textNode.fontName.style + "_" + textNode.fontSize;
	
		textNode.textStyleId = newStyle.id;
		
		console.log("style created successfully");
	
		createdStyles.push({
			fontSize: textNode.fontSize,
			fontNameFamily: textNode.fontName.family,
			fontNameStyle: textNode.fontName.style,
			letterSpacingValue: textNode.letterSpacing.value,
			letterSpacingUnit: textNode.letterSpacing.unit,
			lineHeightValue: textNode.lineHeight.value,
			lineHeightUnit: textNode.lineHeight.unit,
			id: newStyle.id,
		});
		console.log(createdStyles);
	}
	catch (err) {
		console.log("Error: Inside createNewTextStyle => " + err);
	}

}