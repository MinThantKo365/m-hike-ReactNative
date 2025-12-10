import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HikeEntry({ onSubmit, onViewAll }) {

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [parking, setParking] = useState("");
  const [length, setLength] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [trailType, setTrailType] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleSubmit = () => {
    if (!name || !location || !parking || !length || !difficulty) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    onSubmit({
      name,
      location,
      date: date.toISOString().split("T")[0],
      parking,
      length,
      difficulty,
      description,
      trailType,
      estimatedTime,
    });
  };

  return (
    <ScrollView style={{ padding: 20 , marginTop: 30, backgroundColor: '#f9f9f9'}}>
      <Text style={styles.header}>Log Your Hike</Text>

      <Text style={styles.labelRequired}>Name of Hike(required)</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="e.g., Runyon Canyon Trail"
      />

      <Text style={styles.labelRequired}>Location(required)</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholder="City, State/Province"
      />

      <Text style={styles.labelRequired}>Date Completed(required)</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.labelRequired}>Parking Available?(required)</Text>
      <View style={styles.selectorGroup}>
        {["Available", "Unavailable"].map((option) => (
            <TouchableOpacity
                key={option}
                onPress={() => setParking(option)}
                style={[
                    styles.selectorButton,
                    { 
                        backgroundColor: parking === option ? (option === "Available" ? "#4CAF50" : "#f44336") : "#e0e0e0",
                    },
                ]}
            >
                <Text style={[styles.selectorText, { color: parking === option ? 'white' : '#333' }]}>
                    {option === "Available" ? "Yes" : "No"}
                </Text>
            </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.labelRequired}>Length (km) (required)</Text>
      <TextInput
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter total distance (e.g., 8.5)"
      />

      <Text style={styles.labelRequired}>Difficulty (required)</Text>
      <View style={styles.selectorGroup}>
        {["Easy", "Moderate", "Hard"].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setDifficulty(level)}
            style={[
              styles.selectorButton,
              {
                backgroundColor: difficulty === level ? "#2196f3" : "#e0e0e0",
              },
            ]}
          >
            <Text style={[styles.selectorText, { color: difficulty === level ? 'white' : '#333' }]}>
                {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.textArea}
        placeholder="Notes on trail conditions, views, etc."
        textAlignVertical="top" 
      />

     <Text style={styles.label}>Trail Type (optional)</Text>
      <TextInput
        value={trailType}
        onChangeText={setTrailType}
        style={styles.input}
        placeholder="Loop, Out & Back, Point-to-Point"
      />

      <Text style={styles.label}>Estimated Time (minutes, optional)</Text>
      <TextInput
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter time in minutes (e.g., 180)"
      />

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Submit Hike" 
            onPress={handleSubmit} 
            color="#4CAF50" 
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button 
            title="View All Hikes" 
            onPress={onViewAll} 
            color="#3498db" 
          />
        </View>
      </View>
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
  },
  labelRequired: {
    fontSize: 14,
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8, 
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    height: 100, 
    backgroundColor: '#fff',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  selectorGroup: {
    flexDirection: "row",
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  selectorButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden', 
  },
});