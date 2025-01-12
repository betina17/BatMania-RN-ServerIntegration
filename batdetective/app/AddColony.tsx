import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import * as Location from "expo-location";

export default function AddColony({
  onColonyAdded,
}: {
  onColonyAdded: () => void;
}) {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // To handle errors

  const handleAddColony = async () => {
    if (description && latitude && longitude) {
      const time = new Date().toString();

      try {
        const response = await fetch("http://192.168.1.130:3000/add-colony", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
          }),
        });

        const data = await response.json();
        console.log(data); // Check the server response

        if (response.ok) {
          console.log("Colony added successfully");
          onColonyAdded(); // Trigger the parent component to reload the colonies
        } else {
          console.error("Failed to add colony");
        }
      } catch (error) {
        console.error("Error adding colony:", error);
      }
    } else {
      alert("Please fill all fields!");
    }
  };

  // Request location permission and get the current position
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      setLatitude(parseFloat(coords.latitude.toString()).toFixed(5));
      setLongitude(parseFloat(coords.longitude.toString()).toFixed(5));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg("Error getting location: " + error.message);
      } else {
        setErrorMsg("An unknown error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Description"
        placeholderTextColor={"#999999"}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Latitude"
        placeholderTextColor={"#999999"}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Longitude"
        placeholderTextColor={"#999999"}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Get Current Location" onPress={getLocation} />
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <Button title="Add Colony" onPress={handleAddColony} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});
