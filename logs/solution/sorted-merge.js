'use strict'

module.exports = (logSources, printer, isAsync) => {
	let sortPrint = (logSources, isAsync) => {
        let oldestEntry = cycleSources(logSources);
        let sourcePop = isAsync ? 'popAsync' : 'pop';
	
		if(oldestEntry.entry) {
			//log the oldest entry
			printer.print(oldestEntry.entry.last);
			//move the log source forward
			oldestEntry.entry[sourcePop]();
			//restart
			sortPrint(oldestEntry.sources);
		} else printer.done();
	}

	let cycleSources = (logSources) => {
		let oldestEntry = false;
		//cycle the log sources once
		for(let current = logSources.length -1; current >= 0; current --) {
			let logSource = logSources[current];
			//once drained they are useless - throw them to the curb
			if(logSource.drained) {
				logSources.splice(current, 1);
				continue;
			}
			//hunt the oldest of entries - the others live to fight another day
			if(!oldestEntry || logSource.last.date <= oldestEntry.last.date) {
				oldestEntry = logSource;
			}
		}
		return {
			//return oldest entry and and updated logSources
			entry: oldestEntry,
			sources: logSources
		}
	}

	sortPrint(logSources, isAsync);
}