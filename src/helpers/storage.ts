export const getLocalStorage = async (key: string): Promise<string | null> => {
	return await localStorage.getItem(key);
}

export const saveLocalStorage = async (key: string, value: string) => {
	await localStorage.setItem(key, value)
}

export const deleteLocalStorage = async (key: string) => {
	await localStorage.removeItem(key);
}