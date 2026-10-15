// ─── In-Memory Token Blacklist ────────────────────────────────
// كنحفظو { token → expiresAt } فـ Map
// كل ساعة كنحيوو الـ tokens اللي expired باش ما تكبرش الـ memory

const blacklist = new Map() // token → expiresAt (ms)

// نضيف token للـ blacklist
export const blacklistToken = (token, expiresAt) => {
    blacklist.set(token, expiresAt)
}

// نتحققو واش token مبلاكليستي
export const isBlacklisted = (token) => {
    const expiresAt = blacklist.get(token)
    if (!expiresAt) return false
    // إلا expired — نحيوه ونقولو مابقاش blacklisted (JWT verify كيرفضو بصح)
    if (Date.now() > expiresAt) {
        blacklist.delete(token)
        return false
    }
    return true
}

// Cleanup كل ساعة — نحيوو الـ tokens expired
setInterval(() => {
    const now = Date.now()
    for (const [token, expiresAt] of blacklist.entries()) {
        if (now > expiresAt) blacklist.delete(token)
    }
}, 60 * 60 * 1000)