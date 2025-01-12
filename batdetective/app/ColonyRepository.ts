class ColonyRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://192.168.1.130:3000"; // Replace with your server URL
  }

  /**
   * Fetch all colonies from the server.
   * @returns A promise that resolves to an array of colonies.
   */
  async getAllColonies(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/colonies`);
      if (!response.ok) {
        throw new Error("Failed to fetch colonies");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in getAllColonies:", error);
      throw error; // Propagate the error to the caller
    }
  }

  /**
   * Add a new colony to the server.
   * @param colony - The colony data to add.
   */
  async addColony(colony: {
    time: string;
    latitude: number;
    longitude: number;
    description: string;
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/add-colony`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colony),
      });

      if (!response.ok) {
        throw new Error("Failed to add colony");
      }
    } catch (error) {
      console.error("Error in addColony:", error);
      throw error;
    }
  }

  /**
   * Update an existing colony's description.
   * @param colonyId - The ID of the colony to update.
   * @param description - The new description for the colony.
   */
  async updateColony(colonyId: number, description: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/edit-colony/${colonyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update colony");
      }
    } catch (error) {
      console.error("Error in updateColony:", error);
      throw error;
    }
  }

  /**
   * Delete a colony by its ID.
   * @param colonyId - The ID of the colony to delete.
   */
  async deleteColony(colonyId: number): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/delete-colony/${colonyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete colony");
      }
    } catch (error) {
      console.error("Error in deleteColony:", error);
      throw error;
    }
  }
}

export default ColonyRepository;
