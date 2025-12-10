import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import HikeEntry from './components/HikeEntry';
import HikeConfirmation from './components/HikeConfirmation';
import AllHikes from './components/AllHikes';
import HikeDetails from './components/HikeDetail'; 

export default function App() {
    const [hikeDataToConfirmOrEdit, setHikeDataToConfirmOrEdit] = useState(null);
    const [showAllHikes, setShowAllHikes] = useState(false);
    const [selectedHike, setSelectedHike] = useState(null);

    const handleBackToEntry = () => {
        setHikeDataToConfirmOrEdit(null);
        setShowAllHikes(false);
        setSelectedHike(null);
    };
    
    const handleConfirmAndGoToList = () => {
        setHikeDataToConfirmOrEdit(null);
        setShowAllHikes(true);        
        setSelectedHike(null);
    };

    
    const handleViewDetails = (hike) => {
        setSelectedHike(hike);
        setShowAllHikes(false);
    };

    const handleBackToList = () => {
        setSelectedHike(null); 
        setShowAllHikes(true); 
    };

 
    const handleStartEdit = (hike) => {
        setHikeDataToConfirmOrEdit(hike); 
        setSelectedHike(null); 
        setShowAllHikes(false); 
    };

    
    const handleDeleteComplete = () => {
        setSelectedHike(null); 
        setShowAllHikes(true); 
    }

  
    if (selectedHike) {
        return (
            <SafeAreaView style={styles.container}>
                <HikeDetails
                    hike={selectedHike}
                    onBack={handleBackToList}
                    onEdit={() => handleStartEdit(selectedHike)} 
                    onDeleteComplete={handleDeleteComplete}
                />
            </SafeAreaView>
        );
    }
    
   
    if (showAllHikes) {
        return (
            <SafeAreaView style={styles.container}>
                <AllHikes 
                    onBack={handleBackToEntry}
                    onSelectHike={handleViewDetails} 
                    onDeleteComplete={handleDeleteComplete}
                />
            </SafeAreaView>
        );
    }


    if (hikeDataToConfirmOrEdit && hikeDataToConfirmOrEdit.name) {
        return (
            <SafeAreaView style={styles.container}>
                <HikeConfirmation
                    hike={hikeDataToConfirmOrEdit}
                    onEdit={handleBackToEntry} 
                    onConfirm={handleConfirmAndGoToList}
                />
            </SafeAreaView>
        );
    }

  
    return (
        <SafeAreaView style={styles.container}>
            <HikeEntry
                hike={hikeDataToConfirmOrEdit} 
                onSubmit={setHikeDataToConfirmOrEdit}
                onCancel={handleBackToEntry}
                onViewAll={() => setShowAllHikes(true)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
});