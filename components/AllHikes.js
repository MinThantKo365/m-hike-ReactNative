import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { getDb, getAllHikes, deleteHike } from '../database';


export default function AllHikes({ onBack, onSelectHike, onDeleteComplete }) {
    const [hikes, setHikes] = useState([]);
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const initializeDb = async () => {
            try {
                const currentDb = await getDb();
                setDb(currentDb);
            } catch (error) {
                console.error("Failed to initialize database for AllHikes:", error);
                Alert.alert("Error", "Could not connect to the database.");
            }
        };
        initializeDb();
    }, []);

    const fetchHikes = async (database) => {
        if (!database) return;
        setLoading(true);
        try {
            const fetchedHikes = await getAllHikes(database);
            setHikes(fetchedHikes);
        } catch (error) {
            console.error("Error fetching all hikes:", error);
            Alert.alert("Fetch Error", "Failed to load hike data from the database.");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchHikes(db);
    }, [db, onDeleteComplete]); 

    const handleDelete = (hikeId, hikeName) => {
        if (!db) return Alert.alert("Error", "Database is not ready.");

        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete '${hikeName}'?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteHike(db, hikeId);
                            Alert.alert("Success", `Hike '${hikeName}' deleted.`);
                           
                            await fetchHikes(db); 
                            onDeleteComplete(); 
                        } catch (error) {
                            console.error("Delete failed:", error);
                            Alert.alert("Delete Error", "Failed to delete the hike record.");
                        }
                    }
                },
            ]
        );
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Hikes...</Text>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Back to Entry</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    if (hikes.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>You haven't logged any hikes yet!</Text>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Back to Entry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>All Logged Hikes</Text>
                <Text style={styles.countText}>{hikes.length} Total</Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {hikes.map(hike => (
                    <View key={hike.id} style={styles.card}>
                        
                      
                        <TouchableOpacity 
                            style={styles.detailsArea} 
                            onPress={() => onSelectHike(hike)}
                        >
                            <Text style={styles.hikeName}>{hike.name}</Text>
                            <Text style={styles.hikeLocation}>{hike.location}</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoText}>📅 {hike.date}</Text>
                                <Text style={styles.infoText}>📏 {hike.length} km</Text>
                                <Text style={[styles.infoText, styles.difficulty, { backgroundColor: getDifficultyColor(hike.difficulty) }]}>
                                    {hike.difficulty}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    
                        <TouchableOpacity 
                            style={styles.deleteButton} 
                            onPress={() => handleDelete(hike.id, hike.name)}
                        >
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>Back to Entry</Text>
            </TouchableOpacity>
        </View>
    );
}

// Helper function for styling difficulty chips
const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return '#2ecc71'; // Green
        case 'Moderate':
            return '#f39c12'; // Orange
        case 'Hard':
            return '#e74c3c'; // Red
        default:
            return '#95a5a6'; // Gray
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#555',
    },
    emptyText: {
        fontSize: 18,
        color: '#777',
        marginBottom: 20,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    countText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
    scrollViewContent: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    detailsArea: {
        flex: 1,
        padding: 15,
    },
    hikeName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    hikeLocation: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 13,
        color: '#555',
        marginRight: 15,
    },
    difficulty: {
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        overflow: 'hidden', // Essential for background color to work with rounded corners
    },
    deleteButton: {
        backgroundColor: '#c0392b', // Dark Red
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#34495e', // Dark Gray/Blue
        padding: 15,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});