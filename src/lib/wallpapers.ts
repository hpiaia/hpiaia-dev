export const wallpapers = ['teal', 'clouds', 'bliss'] as const

// Runs before first paint so a saved scheme never flashes the default
export const settingsScript = `try{var d=document.documentElement,a=localStorage.getItem('appearance'),w=localStorage.getItem('wallpaper');d.dataset.appearance=a==='dark'?'dark':'light';d.dataset.wallpaper=${JSON.stringify(wallpapers)}.indexOf(w)>-1?w:'teal'}catch(e){}`
