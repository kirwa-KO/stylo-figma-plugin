const createdStyles = [];

let notificationHandler;

let count = 0;

run().then(() => {
	figma.closePlugin();

	notificationHandler.cancel();

	notificationHandler = figma.notify(`${count} text styles created`, {
		timeout: 2000,
	});
});

function showLoadingNotification(message) {
	notificationHandler = figma.notify(message, {
		timeout: 60000,
	});
}

async function run() {
	notificationHandler = figma.notify("Creating text styles...", {
		timeout: 60000,
	});
	if (figma.editorType === "figma") {
		const textNodes = figma.root.findAll((node) => node.type === "TEXT");

		for (let i = 0; i < textNodes.length; i++) {
			if (textNodes[i].textStyleId.length > 0) continue;

			let isStyleCreated = false;
			for (let j = 0; j < createdStyles.length; j++) {
				if (
					textNodes[i].fontName.family ===
						createdStyles[j].fontNameFamily &&
					textNodes[i].fontName.style ===
						createdStyles[j].fontNameStyle &&
					textNodes[i].fontSize === createdStyles[j].fontSize &&
					textNodes[i].letterSpacing.value ===
						createdStyles[j].letterSpacingValue &&
					textNodes[i].letterSpacing.unit ===
						createdStyles[j].letterSpacingUnit &&
					textNodes[i].lineHeight.value ===
						createdStyles[j].lineHeightValue &&
					textNodes[i].lineHeight.unit ===
						createdStyles[j].lineHeightUnit
				) {
					isStyleCreated = true;
					textNodes[i].textStyleId = createdStyles[j].id;
					break;
				}
			}

			if (isStyleCreated == false) {
				try {
					await createNewTextStyle(textNodes[i]);
					count += 1;
				} catch (err) {
					console.error(err);
				}
			}
		}
	}
}

async function createNewTextStyle(textNode) {
	try {
		await figma.loadFontAsync(textNode.fontName);
		const newStyle = figma.createTextStyle();
		newStyle.fontName = textNode.fontName;
		newStyle.fontSize = textNode.fontSize;
		newStyle.letterSpacing = textNode.letterSpacing;
		newStyle.lineHeight = textNode.lineHeight;
		newStyle.lineHeight = textNode.lineHeight;
		newStyle.name =
			textNode.fontName.family +
			"_" +
			textNode.fontName.style +
			"_" +
			textNode.fontSize;

		textNode.textStyleId = newStyle.id;

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
	} catch (err) {
		console.error(err);
	}
}
