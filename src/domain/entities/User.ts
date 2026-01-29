/**
 * User Entity - Core domain model for a user
 */
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string | null = null,
    public avatar: string | null = null,
    public createdAt: Date = new Date(),
  ) {}

  /**
   * Get user initials for avatar placeholder
   */
  getInitials(): string {
    const names = this.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    return this.name;
  }

  /**
   * Check if user has avatar
   */
  hasAvatar(): boolean {
    return this.avatar !== null && this.avatar.length > 0;
  }
}
