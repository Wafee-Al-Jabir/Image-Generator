import { promises as fs } from "fs"
import { join } from "path"

// Database file path
const dbPath = join(process.cwd(), "users.db")

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  plan: string
  credits: number
  joinDate: string
  settings: string
  createdAt: string
  updatedAt: string
}

export interface Generation {
  id: string
  userId: string
  prompt: string
  negativePrompt?: string
  model: string
  imageUrl: string
  settings: string
  liked: number
  createdAt: string
}

export interface UserSettings {
  userId: string
  autoSave: number
  highQuality: number
  defaultModel: string
  emailNotifications: number
  pushNotifications: number
  publicGallery: number
  analytics: number
}

interface Database {
  users: User[]
  generations: Generation[]
  userSettings: UserSettings[]
}

// Initialize empty database structure
const initDb = (): Database => ({
  users: [],
  generations: [],
  userSettings: [],
})

// Read database from file
const readDb = async (): Promise<Database> => {
  try {
    const data = await fs.readFile(dbPath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with empty structure
    const emptyDb = initDb()
    await writeDb(emptyDb)
    return emptyDb
  }
}

// Write database to file
const writeDb = async (db: Database): Promise<void> => {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8")
}

// User operations
export const userDb = {
  create: async (user: Omit<User, "createdAt" | "updatedAt">) => {
    const db = await readDb()
    const newUser: User = {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.users.push(newUser)
    await writeDb(db)
    return { success: true }
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    const db = await readDb()
    return db.users.find((user) => user.email === email)
  },

  findById: async (id: string): Promise<User | undefined> => {
    const db = await readDb()
    return db.users.find((user) => user.id === id)
  },

  updateCredits: async (id: string, credits: number) => {
    const db = await readDb()
    const userIndex = db.users.findIndex((user) => user.id === id)
    if (userIndex !== -1) {
      db.users[userIndex].credits = credits
      db.users[userIndex].updatedAt = new Date().toISOString()
      await writeDb(db)
    }
    return { success: true }
  },

  update: async (id: string, updates: Partial<User>) => {
    const db = await readDb()
    const userIndex = db.users.findIndex((user) => user.id === id)
    if (userIndex !== -1) {
      db.users[userIndex] = {
        ...db.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      await writeDb(db)
    }
    return { success: true }
  },
}

// Generation operations
export const generationDb = {
  create: async (generation: Omit<Generation, "createdAt">) => {
    const db = await readDb()
    const newGeneration: Generation = {
      ...generation,
      createdAt: new Date().toISOString(),
    }
    db.generations.push(newGeneration)
    await writeDb(db)
    return { success: true }
  },

  findByUserId: async (userId: string, limit = 50): Promise<Generation[]> => {
    const db = await readDb()
    return db.generations
      .filter((gen) => gen.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  },

  updateLiked: async (id: string, liked: number) => {
    const db = await readDb()
    const genIndex = db.generations.findIndex((gen) => gen.id === id)
    if (genIndex !== -1) {
      db.generations[genIndex].liked = liked
      await writeDb(db)
    }
    return { success: true }
  },

  delete: async (id: string) => {
    const db = await readDb()
    db.generations = db.generations.filter((gen) => gen.id !== id)
    await writeDb(db)
    return { success: true }
  },
}

// Settings operations
export const settingsDb = {
  create: async (settings: UserSettings) => {
    const db = await readDb()
    const existingIndex = db.userSettings.findIndex((s) => s.userId === settings.userId)
    if (existingIndex !== -1) {
      db.userSettings[existingIndex] = settings
    } else {
      db.userSettings.push(settings)
    }
    await writeDb(db)
    return { success: true }
  },

  findByUserId: async (userId: string): Promise<UserSettings | undefined> => {
    const db = await readDb()
    return db.userSettings.find((settings) => settings.userId === userId)
  },

  update: async (userId: string, updates: Partial<UserSettings>) => {
    const db = await readDb()
    const settingsIndex = db.userSettings.findIndex((s) => s.userId === userId)
    if (settingsIndex !== -1) {
      db.userSettings[settingsIndex] = {
        ...db.userSettings[settingsIndex],
        ...updates,
      }
      await writeDb(db)
    }
    return { success: true }
  },
}
