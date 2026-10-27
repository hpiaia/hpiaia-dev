export const wallpapers = [
  'teal',
  'clouds',
  'windows-98',
  'space',
  'underwater',
  'carved-stone',
  'bubbles',
  'forest',
  'blue-rivets',
] as const

// Windows 98 originals (© Microsoft), styled in app.css
export const wallpaperNames: Record<(typeof wallpapers)[number], string> = {
  teal: '(None)',
  clouds: 'Clouds',
  'windows-98': 'Windows 98',
  space: 'Space',
  underwater: 'Underwater',
  'carved-stone': 'Carved Stone',
  bubbles: 'Bubbles',
  forest: 'Forest',
  'blue-rivets': 'Blue Rivets',
}

export const settingsKey = 'hpiaia97'

// Runs before first paint so a saved scheme never flashes the default
export const settingsScript = `try{var d=document.documentElement,s=(JSON.parse(localStorage.getItem('${settingsKey}'))||{}).state||{};d.dataset.appearance=s.appearance==='dark'?'dark':'light';d.dataset.wallpaper=${JSON.stringify(wallpapers)}.indexOf(s.wallpaper)>-1?s.wallpaper:'teal'}catch(e){}`
