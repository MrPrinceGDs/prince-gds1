let handler = async (m, { text, quoted, usedPrefix, command, conn }) => {
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `✳️ براہ کرم کوئی پیغام دیں یا کسی میسج کو ریپلائی کریں جسے ڈیزائن کرنا ہے۔\n\nمثال:\n*${usedPrefix + command} اپنی روح کو صاف کریں ❤️‍🩹*`
  }

  if (!text && m.quoted?.text) {
    text = m.quoted.text
  }

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  const targetLetters = new Set([
    'ت','ع','ق','ک','پ','ج','ھ','ف','ی','ہ',
    'س','ط','ب','ل','خ','ح','ش','م','ن','ض',
    'ص','گ','ظ','ٹ','چ'
  ])

  const stretch = 'ـــٓ٘͜ـ'
  const segmenter = new Intl.Segmenter('ur', { granularity: 'grapheme' })

  function stylizeWord(word) {
    if (!word || word.length <= 1) return word
    let prefix = '', suffix = '', core = word

    const leading = core.match(/^[^\p{L}]+/u)
    if (leading) { prefix = leading[0]; core = core.slice(prefix.length) }

    const trailing = core.match(/[^\p{L}]+$/u)
    if (trailing) { suffix = trailing[0]; core = core.slice(0, core.length - trailing[0].length) }

    if (!core) return word

    const graphemes = Array.from(segmenter.segment(core)).map(s => s.segment)
    let processed = ''
    for (let i = 0; i < graphemes.length; i++) {
      const ch = graphemes[i]
      if (targetLetters.has(ch) && i !== graphemes.length - 1) {
        processed += ch + stretch
      } else {
        processed += ch
      }
    }
    return prefix + processed + suffix
  }

  function stylizeLineFull(line) {
    return line.split(' ').map(p => stylizeWord(p)).join(' ')
  }

  function stylizeLinePartial(line) {
    return line.split(' ').map((p, idx) => {
      if (!p.trim()) return p
      return idx % 2 === 0 ? stylizeWord(p) : p
    }).join(' ')
  }

  const header = `🌼♥️\n\n`
  const lines = text.split('\n')

  const finalLines = lines.map(line => {
    const cleanLine = line.trim()
    if (!cleanLine) return ''

    if (/قرآن|حدیث/.test(cleanLine)) {
      const hasStars = cleanLine.startsWith('*') && cleanLine.endsWith('*')
      const inner = hasStars ? cleanLine.replace(/^\*+|\*+$/g, '') : cleanLine
      const styled = stylizeLineFull(inner)
      return `*${styled}*`
    }

    if (cleanLine.startsWith('*') && cleanLine.endsWith('*')) {
      const inner = cleanLine.replace(/^\*+|\*+$/g, '')
      return `*${stylizeLinePartial(inner)}*`
    }

    return stylizeLinePartial(cleanLine)
  })

  const footer = `\n\n🌼♥️`
  const finalMessage = header + finalLines.join('\n') + footer

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  await m.reply(finalMessage)
}

handler.help = ['stylish']
handler.tags = ['fancy']
handler.command = /^stylish|st$/i

export default handler
