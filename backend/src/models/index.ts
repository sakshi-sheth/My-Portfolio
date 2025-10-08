import pool from "../config/database";
import {
  User,
  Skill,
  Experience,
  Project,
  Contact,
  PersonalInfo,
} from "../types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return (rows[0] as User) || null;
  }

  static async create(
    userData: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    const { email, password, role } = userData;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, password, role]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );
    return rows[0] as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return (rows[0] as User) || null;
  }
}

export class SkillModel {
  static async getAll(): Promise<Skill[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM skills ORDER BY display_order, name"
    );
    return rows as Skill[];
  }

  static async getByCategory(category: string): Promise<Skill[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM skills WHERE category = ? ORDER BY display_order, name",
      [category]
    );
    return rows as Skill[];
  }

  static async getFeatured(): Promise<Skill[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM skills WHERE is_featured = true ORDER BY display_order, name"
    );
    return rows as Skill[];
  }

  static async create(
    skillData: Omit<Skill, "id" | "created_at" | "updated_at">
  ): Promise<Skill> {
    const { name, category, proficiency, icon, display_order, is_featured } =
      skillData;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO skills (name, category, proficiency, icon, display_order, is_featured) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, proficiency, icon, display_order, is_featured]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM skills WHERE id = ?",
      [result.insertId]
    );
    return rows[0] as Skill;
  }

  static async update(
    id: number,
    skillData: Partial<Skill>
  ): Promise<Skill | null> {
    const fields = Object.keys(skillData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(skillData);

    await pool.execute(`UPDATE skills SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM skills WHERE id = ?",
      [id]
    );
    return (rows[0] as Skill) || null;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM skills WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class ExperienceModel {
  static async getAll(): Promise<Experience[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM experience ORDER BY start_date DESC"
    );
    return rows.map((row: any) => ({
      ...row,
      responsibilities: ExperienceModel.parseJsonSafely(row.responsibilities),
      technologies: ExperienceModel.parseJsonSafely(row.technologies),
    })) as Experience[];
  }

  private static parseJsonSafely(value: string | any[]): any[] {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If it's not valid JSON, treat as single item array
        return [value];
      }
    }
    return [];
  }

  static async create(
    experienceData: Omit<Experience, "id" | "created_at" | "updated_at">
  ): Promise<Experience> {
    const {
      title,
      company,
      location,
      start_date,
      end_date,
      is_current,
      description,
      responsibilities,
      technologies,
      display_order,
    } = experienceData;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, responsibilities, technologies, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        company,
        location,
        start_date,
        end_date,
        is_current,
        description,
        JSON.stringify(responsibilities),
        JSON.stringify(technologies),
        display_order,
      ]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM experience WHERE id = ?",
      [result.insertId]
    );
    const experience = rows[0] as any;
    return {
      ...experience,
      responsibilities: ExperienceModel.parseJsonSafely(
        experience.responsibilities
      ),
      technologies: ExperienceModel.parseJsonSafely(experience.technologies),
    } as Experience;
  }

  static async update(
    id: number,
    experienceData: Partial<Experience>
  ): Promise<Experience | null> {
    // Convert arrays to JSON strings for database storage
    const processedData = { ...experienceData };
    if (
      processedData.responsibilities &&
      Array.isArray(processedData.responsibilities)
    ) {
      processedData.responsibilities = JSON.stringify(
        processedData.responsibilities
      ) as any;
    }
    if (
      processedData.technologies &&
      Array.isArray(processedData.technologies)
    ) {
      processedData.technologies = JSON.stringify(
        processedData.technologies
      ) as any;
    }

    const fields = Object.keys(processedData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(processedData);

    await pool.execute(`UPDATE experience SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM experience WHERE id = ?",
      [id]
    );
    const experience = rows[0] as any;
    if (experience) {
      return {
        ...experience,
        responsibilities: ExperienceModel.parseJsonSafely(
          experience.responsibilities
        ),
        technologies: ExperienceModel.parseJsonSafely(experience.technologies),
      } as Experience;
    }
    return null;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM experience WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class ProjectModel {
  static async getAll(): Promise<Project[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM projects ORDER BY display_order, created_at DESC"
    );
    return rows as Project[];
  }

  static async getFeatured(): Promise<Project[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM projects WHERE is_featured = true ORDER BY display_order, created_at DESC"
    );
    return rows as Project[];
  }

  static async create(
    projectData: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> {
    const {
      title,
      description,
      long_description,
      technologies,
      image_url,
      demo_url,
      github_url,
      is_featured,
      display_order,
      status,
    } = projectData;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO projects (title, description, long_description, technologies, image_url, demo_url, github_url, is_featured, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        long_description,
        technologies,
        image_url,
        demo_url,
        github_url,
        is_featured,
        display_order,
        status,
      ]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM projects WHERE id = ?",
      [result.insertId]
    );
    return rows[0] as Project;
  }

  static async update(
    id: number,
    projectData: Partial<Project>
  ): Promise<Project | null> {
    const fields = Object.keys(projectData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(projectData);

    await pool.execute(`UPDATE projects SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    return (rows[0] as Project) || null;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class ContactModel {
  static async getAll(): Promise<Contact[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM contact ORDER BY created_at DESC"
    );
    return rows as Contact[];
  }

  static async findById(id: number): Promise<Contact | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM contact WHERE id = ?",
      [id]
    );
    return (rows[0] as Contact) || null;
  }

  static async create(
    contactData: Omit<Contact, "id" | "is_read" | "created_at" | "updated_at">
  ): Promise<Contact> {
    const { name, email, subject, message } = contactData;
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM contact WHERE id = ?",
      [result.insertId]
    );
    return rows[0] as Contact;
  }

  static async markAsRead(id: number): Promise<Contact | null> {
    await pool.execute("UPDATE contact SET is_read = true WHERE id = ?", [id]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM contact WHERE id = ?",
      [id]
    );
    return (rows[0] as Contact) || null;
  }

  static async updateStatus(
    id: number,
    status: string
  ): Promise<Contact | null> {
    // Map status to is_read boolean for database compatibility
    const isRead = status === "read" || status === "replied";
    await pool.execute("UPDATE contact SET is_read = ? WHERE id = ?", [
      isRead,
      id,
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM contact WHERE id = ?",
      [id]
    );
    return (rows[0] as Contact) || null;
  }

  static async getStats(): Promise<{
    total: number;
    unread: number;
    read: number;
  }> {
    const [totalRows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM contact"
    );
    const [unreadRows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM contact WHERE is_read = false"
    );
    const [readRows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM contact WHERE is_read = true"
    );

    return {
      total: (totalRows[0] as any).count,
      unread: (unreadRows[0] as any).count,
      read: (readRows[0] as any).count,
    };
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM contact WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class PersonalInfoModel {
  static async get(): Promise<PersonalInfo | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM personal_info ORDER BY id LIMIT 1"
    );
    return (rows[0] as PersonalInfo) || null;
  }

  static async createOrUpdate(
    personalData: Omit<PersonalInfo, "id" | "updated_at">
  ): Promise<PersonalInfo> {
    const {
      name,
      title,
      bio,
      email,
      phone,
      location,
      linkedin_url,
      github_url,
      resume_url,
      profile_image_url,
    } = personalData;

    // Check if record exists
    const existing = await this.get();

    if (existing) {
      await pool.execute(
        "UPDATE personal_info SET name = ?, title = ?, bio = ?, email = ?, phone = ?, location = ?, linkedin_url = ?, github_url = ?, resume_url = ?, profile_image_url = ? WHERE id = ?",
        [
          name,
          title,
          bio,
          email,
          phone,
          location,
          linkedin_url,
          github_url,
          resume_url,
          profile_image_url,
          existing.id,
        ]
      );

      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM personal_info WHERE id = ?",
        [existing.id]
      );
      return rows[0] as PersonalInfo;
    } else {
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO personal_info (name, title, bio, email, phone, location, linkedin_url, github_url, resume_url, profile_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          title,
          bio,
          email,
          phone,
          location,
          linkedin_url,
          github_url,
          resume_url,
          profile_image_url,
        ]
      );

      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM personal_info WHERE id = ?",
        [result.insertId]
      );
      return rows[0] as PersonalInfo;
    }
  }
}
