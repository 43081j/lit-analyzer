/* eslint-disable @typescript-eslint/no-explicit-any */
import { LanguageService } from "typescript";
import { logger } from "./logger";
import { TsLitPlugin } from "./ts-lit-plugin/ts-lit-plugin";

export function decorateLanguageService(languageService: LanguageService, plugin: TsLitPlugin): LanguageService {
	const nextLanguageService: LanguageService = {
		...languageService,
		getCompletionsAtPosition: plugin.getCompletionsAtPosition.bind(plugin),
		getCompletionEntryDetails: plugin.getCompletionEntryDetails.bind(plugin),
		getSemanticDiagnostics: plugin.getSemanticDiagnostics.bind(plugin),
		getDefinitionAndBoundSpan: plugin.getDefinitionAndBoundSpan.bind(plugin),
		getCodeFixesAtPosition: plugin.getCodeFixesAtPosition.bind(plugin),
		getQuickInfoAtPosition: plugin.getQuickInfoAtPosition.bind(plugin),
		getJsxClosingTagAtPosition: plugin.getJsxClosingTagAtPosition.bind(plugin),
		getRenameInfo: plugin.getRenameInfo.bind(plugin),
		findRenameLocations: plugin.findRenameLocations.bind(plugin)

		//getOutliningSpans: plugin.getOutliningSpans.bind(plugin)
		//getFormattingEditsForRange: plugin.getFormattingEditsForRange.bind(plugin)
	};

	// Make sure to call the old service if config.disable === true
	for (const methodName of Object.getOwnPropertyNames(nextLanguageService)) {
		const newMethod = (nextLanguageService as any)[methodName];
		const oldMethod = (languageService as any)[methodName];

		if (newMethod !== oldMethod) {
			(nextLanguageService as any)[methodName] = function() {
				if (plugin.context.config.disable && oldMethod != null) {
					return oldMethod(...arguments);
				}

				return wrapTryCatch(newMethod, oldMethod, methodName)(...arguments);
			};
		}
	}

	// Wrap all method called to the service in logging and performance measuring
	for (const methodName of Object.getOwnPropertyNames(nextLanguageService)) {
		const isDecorated = (nextLanguageService as any)[methodName] != null;
		if (isDecorated) {
			const method = (nextLanguageService as any)[methodName];
			(nextLanguageService as any)[methodName] = wrapLog(methodName, method, plugin);
		}
	}
	return nextLanguageService;
}

/**
 * Wraps a function in try catch in order to debug the plugin.
 * If the function throws, this function logs the error.
 * @param newMethod
 * @param oldMethod
 * @param methodName
 */
function wrapTryCatch<T extends Function>(newMethod: T, oldMethod: T, methodName: string): T {
	return (((...args: unknown[]) => {
		try {
			return newMethod(...args);
		} catch (e) {
			logger.error(`Error [${methodName}]: (${e.stack}) ${e.message}`, e);

			// Always return the old method if anything fails
			// Don't crash everything :-)
			return oldMethod(...args);
		}
	}) as unknown) as T;
}

/**
 * Wraps a function so that it is logged every time the function called.
 * @param name
 * @param proxy
 * @param plugin
 */
function wrapLog<T extends Function>(name: string, proxy: T, plugin: TsLitPlugin): T {
	return (((...args: unknown[]) => {
		if (plugin.context.config.logging === "verbose") {
			/**/
			const startTime = Date.now();
			logger.verbose(`[${name}] Called`);
			const result = proxy(...args);
			const time = Math.round(Date.now() - startTime);
			logger.verbose(
				`[${name}] Finished (${time}ms): Result: `,
				result == null ? "undefined" : Array.isArray(result) ? `Array: ${result.length} length` : "defined"
			);
			if (time > 100) {
				logger.warn(`[${name}] took long time to complete! (${time}ms)`);
			}
			return result;
		} else {
			return proxy(...args);
		}
	}) as unknown) as T;
}
