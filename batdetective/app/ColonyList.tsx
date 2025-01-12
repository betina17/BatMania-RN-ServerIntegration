import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";

export default function ColonyList() {
  const [colonies, setColonies] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDescription, setEditingDescription] = useState(""); // State for editing description
  const [editingColonyId, setEditingColonyId] = useState<number | null>(null); // Colony ID for editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [colonyToDelete, setColonyToDelete] = useState<number | null>(null); // Store the colony ID to delete

  useEffect(() => {
    loadColonies();
  }, []);

  const loadColonies = async () => {
    try {
      const response = await fetch("http://192.168.1.130:3000/colonies"); // Updated IP address to your local network IP
      const data = await response.json();
      setColonies(data);
    } catch (error) {
      console.error("Error loading colonies:", error);
    }
  };

  // Delete confirmation logic
  const showDeleteConfirmation = (id: number) => {
    setColonyToDelete(id); // Set the colony ID to be deleted
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const handleDelete = async () => {
    if (colonyToDelete !== null) {
      try {
        const response = await fetch(
          `http://192.168.1.130:3000/delete-colony/${colonyToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          loadColonies(); // Reload colonies after deleting
          setIsDeleteModalVisible(false); // Close the modal
          setColonyToDelete(null); // Reset the colony ID
        } else {
          console.error("Failed to delete colony");
        }
      } catch (error) {
        console.error("Error deleting colony:", error);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false); // Close the modal without deleting
    setColonyToDelete(null); // Reset the colony ID
  };

  // Open the modal with the current description of the colony
  const handleEdit = (colonyId: number, currentDescription: string) => {
    setEditingColonyId(colonyId);
    setEditingDescription(currentDescription);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const trimmedDescription = editingDescription.trim();

    if (trimmedDescription !== "") {
      try {
        const response = await fetch(
          `http://192.168.1.130:3000/edit-colony/${editingColonyId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: trimmedDescription }),
          }
        );

        if (response.ok) {
          loadColonies(); // Reload colonies after editing
          setIsModalVisible(false); // Close the modal
        } else {
          console.error("Failed to update colony");
        }
      } catch (error) {
        console.error("Error updating colony:", error);
      }
    } else {
      console.error("Description cannot be empty");
      alert("Description cannot be empty");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={colonies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.colonyItem}>
            <Text style={styles.text}>Description: {item.description}</Text>
            <Text style={styles.text}>Time: {item.time}</Text>
            <Text style={styles.text}>
              Lat: {item.latitude}, Long: {item.longitude}
            </Text>
            <Button
              title="Delete"
              onPress={() => showDeleteConfirmation(item.id)}
            />
            <Button
              title="Edit Description"
              onPress={() => handleEdit(item.id, item.description)}
            />
          </View>
        )}
      />

      {/* Modal for editing the description */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Description</Text>
          <TextInput
            value={editingDescription}
            onChangeText={setEditingDescription}
            style={styles.input}
          />
          <Button title="Save" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal visible={isDeleteModalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Are you sure you want to delete this colony?
          </Text>
          <Button title="Yes, Delete" onPress={handleDelete} />
          <Button title="Cancel" onPress={cancelDelete} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  colonyItem: { padding: 10, borderBottomWidth: 1, marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
    width: "80%",
  },
});
