import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ToastAndroid, // Used for displaying Android-style notifications
  TouchableOpacity,
  Alert // Use Alert for more critical feedback or iOS compatibility
} from 'react-native';
import { getDb, addHike } from '../database';


export default function HikeConfirmation({ hike, onEdit, onConfirm }) {
    

    const renderStat = (label, value, unit = '') => {

        if (value === null || value === undefined || value === '') return null;


        let displayValue = value;
        if (label === 'Parking') {

            displayValue = value === 'Available' ? '✅ Yes' : (value === 'Unavailable' ? '❌ No' : value);
        }
        
        return (
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{displayValue} {unit}</Text>
            </View>
        );
    };

    const handleConfirm = async () => {
        try {
            const db = await getDb();
            await addHike(db, hike);
            

            Alert.alert("Success!", `The hike "${hike.name}" has been logged successfully.`);
            onConfirm(); 
        } catch (error) {
            console.error('Error adding hike:', error);
      
            Alert.alert("Database Error", "Failed to add hike. Please check all fields.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <Text style={styles.title}>Review & Confirm Hike</Text>
            
            <View style={[styles.baseCard, styles.mainInfoCard]}>
                <Text style={styles.hikeName}>{hike.name}</Text>
                <Text style={styles.hikeLocation}>{hike.location}</Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Logged Date:</Text> {hike.date}
                </Text>
            </View>


            <View style={[styles.baseCard, styles.statsGroup]}>
                {renderStat("Length", hike.length, 'km')}
                {renderStat("Difficulty", hike.difficulty)}
                {renderStat("Parking", hike.parking)}
                {renderStat("Time", hike.estimatedTime, 'min')}
                {renderStat("Trail Type", hike.trailType)}
            </View>


            {hike.description ? (
                <View style={[styles.baseCard, styles.descriptionCard]}>
                    <Text style={styles.descriptionLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{hike.description}</Text>
                </View>
            ) : null}


            <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
                    <Text style={styles.buttonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>✓ Confirm & Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollContent: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: '#333',
      marginBottom: 15,
      textAlign: 'center',
    },
    // --- Card Styles ---
    baseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    // --- Main Info ---
    mainInfoCard: {
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50', // Accent color
    },
    hikeName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    hikeLocation: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    label: {
        fontWeight: '700',
        color: '#333',
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    // --- Stats Group ---
    statsGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    statItem: {
        width: '48%', // Two columns
        marginBottom: 15,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    // --- Description ---
    descriptionCard: {
        minHeight: 100,
    },
    descriptionLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    // --- Action Buttons ---
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    editButton: {
        backgroundColor: '#f39c12', // Orange for Edit
    },
    confirmButton: {
        backgroundColor: '#27ae60', // Green for Confirm
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});