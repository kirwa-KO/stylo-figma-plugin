

const fruites = [];

run();

async function run() {
	for (let i = 0; i < 3; i++) {
		if (i !== 2)
			await fruites_promise("fruit_" + i);
		console.log(fruites);
	}
}

function promiseSS(fruit) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(fruit);
		}, 1000);
	});
}

async function fruites_promise(fruit) {
	const fruit_promise = promiseSS(fruit);
	const fruit_promise_res = await fruit_promise;
	fruites.push(fruit_promise_res);
	// console.log(fruites);
}