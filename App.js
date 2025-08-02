import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  StatusBar,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Data ---
const routineData = [
    // Monday
    { day: 'Monday', time: '10:30 - 11:30', subject: '', professor: '', location: '' },
    { day: 'Monday', time: '11:30 - 12:30', subject: '', professor: '', location: '' },
    { day: 'Monday', time: '12:30 - 13:30', subject: 'LUNCH', professor: '', location: '' },
    { day: 'Monday', time: '13:30 - 14:30', subject: 'Microwaves', professor: 'Dr. Rajan Agrahari', location: 'EE 2nd Floor CR-2' },
    { day: 'Monday', time: '14:30 - 15:30', subject: 'AI & ML', professor: 'Dr. Syed Shahnawazuddin', location: 'ECE Ground Floor CR-1' },
    { day: 'Monday', time: '15:30 - 16:30', subject: 'Adv. Comm. Lab', professor: 'Dr. Ajay Kumar Maurya', location: 'Adv. Comm. Engg. Lab' },
    { day: 'Monday', time: '16:30 - 17:30', subject: 'Adv. Comm. Lab', professor: 'Dr. Ajay Kumar Maurya', location: 'Adv. Comm. Engg. Lab' },

    // Tuesday
    { day: 'Tuesday', time: '10:30 - 11:30', subject: '', professor: '', location: '' },
    { day: 'Tuesday', time: '11:30 - 12:30', subject: '', professor: '', location: '' },
    { day: 'Tuesday', time: '12:30 - 13:30', subject: 'LUNCH', professor: '', location: '' },
    { day: 'Tuesday', time: '13:30 - 14:30', subject: 'Control Systems', professor: 'Dr. Nishad Anwar', location: 'Control System Lab' },
    { day: 'Tuesday', time: '14:30 - 15:30', subject: 'Control Systems', professor: 'Dr. Nishad Anwar', location: 'Control System Lab' },
    { day: 'Tuesday', time: '15:30 - 16:30', subject: 'AI & ML', professor: 'Dr. Syed Shahnawazuddin', location: 'ECE Ground Floor CR-1' },
    { day: 'Tuesday', time: '16:30 - 17:30', subject: 'Adv. Comm.', professor: 'Dr. Ajay Kumar Maurya', location: 'Adv. Comm. Engg. Lab' },

    // Wednesday
    { day: 'Wednesday', time: '10:30 - 11:30', subject: 'Green Tech.', professor: 'Dr. S. Das Gupta', location: 'ECE Ground Floor CR-1' },
    { day: 'Wednesday', time: '11:30 - 12:30', subject: 'Green Tech.', professor: 'Dr. S. Das Gupta', location: 'ECE Ground Floor CR-1' },
    { day: 'Wednesday', time: '12:30 - 13:30', subject: 'LUNCH', professor: '', location: '' },
    { day: 'Wednesday', time: '13:30 - 14:30', subject: '', professor: '', location: '' },
    { day: 'Wednesday', time: '14:30 - 15:30', subject: 'Microwaves', professor: 'Dr. Rajan Agrahari', location: 'EE 2nd Floor CR-2' },
    { day: 'Wednesday', time: '15:30 - 16:30', subject: 'Control Systems', professor: 'Dr. Nishad Anwar', location: 'Control System Lab' },
    { day: 'Wednesday', time: '16:30 - 17:30', subject: 'Adv. Comm.', professor: 'Dr. Ajay Kumar Maurya', location: 'Adv. Comm. Engg. Lab' },

    // Thursday
    { day: 'Thursday', time: '10:30 - 11:30', subject: '', professor: '', location: '' },
    { day: 'Thursday', time: '11:30 - 12:30', subject: 'Cyber Security', professor: 'CSE Faculty', location: 'ECE Ground Floor CR-1' },
    { day: 'Thursday', time: '12:30 - 13:30', subject: 'LUNCH', professor: '', location: '' },
    { day: 'Thursday', time: '13:30 - 14:30', subject: '', professor: '', location: '' },
    { day: 'Thursday', time: '14:30 - 15:30', subject: 'Microwaves', professor: 'Dr. Rajan Agrahari', location: 'EE 2nd Floor CR-2' },
    { day: 'Thursday', time: '15:30 - 16:30', subject: 'AI & ML', professor: 'Dr. Syed Shahnawazuddin', location: 'ECE Ground Floor CR-1' },
    { day: 'Thursday', time: '16:30 - 17:30', subject: '', professor: '', location: '' },

    // Friday
    { day: 'Friday', time: '10:30 - 11:30', subject: 'Cyber Security', professor: 'CSE Faculty', location: 'ECE Ground Floor CR-1' },
    { day: 'Friday', time: '11:30 - 12:30', subject: 'Cyber Security', professor: 'CSE Faculty', location: 'ECE Ground Floor CR-1' },
    { day: 'Friday', time: '12:30 - 13:30', subject: 'LUNCH', professor: '', location: '' },
    { day: 'Friday', time: '13:30 - 14:30', subject: '', professor: '', location: '' },
    { day: 'Friday', time: '14:30 - 15:30', subject: 'Adv. Comm.', professor: 'Dr. Ajay Kumar Maurya', location: 'Adv. Comm. Engg. Lab' },
    { day: 'Friday', time: '15:30 - 16:30', subject: 'Microwaves Lab', professor: 'Dr. Rajan Agrahari', location: 'Microwave Engg. Lab' },
    { day: 'Friday', time: '16:30 - 17:30', subject: 'Microwaves Lab', professor: 'Dr. Rajan Agrahari', location: 'Microwave Engg. Lab' },
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
    '10:30 - 11:30', '11:30 - 12:30',
    '12:30 - 13:30', '13:30 - 14:30', '14:30 - 15:30', '15:30 - 16:30', '16:30 - 17:30'
];

// --- Helper Functions ---
const getCellBackgroundColor = (subject) => {
    if (!subject) return '#f0f0f0';
    if (subject === 'LUNCH') return '#FFDDC1';
    if (subject.includes('Microwave')) return '#D1F2EB';
    if (subject.includes('AI & ML')) return '#FCF3CF';
    if (subject.includes('Adv. Comm.')) return '#E8DAEF';
    if (subject.includes('Control')) return '#FADBD8';
    if (subject.includes('Green Tech')) return '#D6EAF8';
    if (subject.includes('Cyber Security')) return '#D5F5E3';
    return '#E5E7E9';
};

// --- Components ---
const TimetableView = () => (
  <ScrollView style={{ flex: 1 }}>
    <ScrollView horizontal>
      <View>
        {/* Header Row */}
        <View style={styles.row}>
          <View style={[styles.headerCell, styles.dayHeaderCell]}><Text style={styles.headerCellText}>Day/Time</Text></View>
          {timeSlots.map(time => (
            <View key={time} style={[styles.headerCell, styles.timeHeaderCell]}><Text style={styles.headerCellText}>{time}</Text></View>
          ))}
        </View>
        {/* Data Rows */}
        {days.map(day => (
          <View key={day} style={styles.row}>
            <View style={[styles.headerCell, styles.dayHeaderCell]}><Text style={styles.headerCellText}>{day}</Text></View>
            {timeSlots.map(time => {
              const entry = routineData.find(e => e.day === day && e.time === time);
              return (
                <View key={`${day}-${time}`} style={[styles.cell, { backgroundColor: getCellBackgroundColor(entry?.subject) }]}>
                  <Text style={styles.cellSubject}>{entry?.subject}</Text>
                  <Text style={styles.cellProfessor}>{entry?.professor}</Text>
                  <Text style={styles.cellLocation}>{entry?.location}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
    {/* Legend */}
    <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#D1F2EB'}]} /> Microwaves (EC55102) - Dr. Rajan Agrahari</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#FCF3CF'}]} /> AI & ML (EC55127) - Dr. Syed Shahnawazuddin</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#E8DAEF'}]} /> Advanced Communications (EC55101) - Dr. Ajay Kumar Maurya</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#FADBD8'}]} /> Control Systems (EE55101) - Dr. Nishad Anwar</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#D6EAF8'}]} /> Green Tech (CH55102) - Dr. S. Das Gupta</Text>
        <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: '#D5F5E3'}]} /> Cyber Security (OE-CSE) - CSE Faculty</Text>
    </View>
  </ScrollView>
);

const TodayView = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDesc, setTaskDesc] = useState('');
  
  // State for the time picker
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const todayKey = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(todayKey);
        if (storedTasks) setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Failed to load tasks.", error);
      }
    };
    loadTasks();
  }, []);

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Keep picker open on iOS
    setDate(currentDate);
  };

  const handleAddTask = async () => {
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    if (!formattedTime || !taskDesc) return;
    
    const newTasks = [...tasks, { time: formattedTime, description: taskDesc }];
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem(todayKey, JSON.stringify(newTasks));
    } catch (error) {
       console.error("Failed to save task.", error);
    }
    setModalVisible(false);
    setTaskDesc('');
  };

  const dayIndex = new Date().getDay();
  const todayName = (dayIndex > 0 && dayIndex < 6) ? days[dayIndex - 1] : null;

  const scheduledClasses = todayName ? routineData
    .filter(item => item.day === todayName && item.subject)
    .map(item => ({...item, type: 'class', startTime: item.time.split(' - ')[0] })) : [];

  const userTasks = tasks.map(task => ({ ...task, type: 'user-task', startTime: task.time }));
  const allItems = [...scheduledClasses, ...userTasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.todayViewContainer}>
        <View style={styles.timelineContainer}>
          {allItems.length === 0 ? (
            <View style={styles.timelineItem}><Text>No classes or tasks for today. Enjoy your day off!</Text></View>
          ) : (
            allItems.map((item, index) => (
              <View key={index} style={[styles.timelineItem, item.type === 'user-task' && styles.userTaskItem]}>
                <Text style={styles.timelineTime}>{item.time || item.startTime}</Text>
                <Text style={styles.timelineSubject}>{item.subject || item.description}</Text>
                {item.type === 'class' && (
                  <>
                    <Text style={styles.timelineDetails}>{item.professor}</Text>
                    <Text style={[styles.timelineDetails, { fontStyle: 'italic' }]}>{item.location}</Text>
                  </>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            {/* Time Picker Button */}
            <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowPicker(true)}>
                <Text style={styles.timePickerButtonText}>
                    Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
            </TouchableOpacity>

            {/* The Actual Time Picker */}
            {showPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'time'}
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
              />
            )}

            <TextInput style={styles.input} placeholder="Task Description" value={taskDesc} onChangeText={setTaskDesc} />
            <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonAdd]} onPress={handleAddTask}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('timetable');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>ECE Department Timetable</Text>
        <Text style={styles.subHeaderText}>UG 5th Semester | Jul-Dec 2025</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navButton, activeView === 'timetable' && styles.navButtonActive]}
          onPress={() => setActiveView('timetable')}>
          <Text style={[styles.navText, activeView === 'timetable' && styles.navTextActive]}>Weekly Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeView === 'today' && styles.navButtonActive]}
          onPress={() => setActiveView('today')}>
          <Text style={[styles.navText, activeView === 'today' && styles.navTextActive]}>Today's Plan</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {activeView === 'timetable' ? <TimetableView /> : <TodayView />}
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  subHeaderText: { fontSize: 14, color: '#555' },
  nav: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd', justifyContent: 'center' },
  navButton: { paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center' },
  navButtonActive: { borderBottomWidth: 3, borderColor: '#007AFF' },
  navText: { fontSize: 16, color: '#333' },
  navTextActive: { color: '#007AFF', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  // Timetable styles
  row: { flexDirection: 'row' },
  headerCell: { padding: 8, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' },
  dayHeaderCell: { width: 90 },
  timeHeaderCell: { width: 110 },
  headerCellText: { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  cell: { width: 110, height: 90, borderWidth: 1, borderColor: '#ddd', padding: 4, justifyContent: 'center', alignItems: 'center' },
  cellSubject: { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  cellProfessor: { fontSize: 9, color: '#333', textAlign: 'center', marginTop: 2 },
  cellLocation: { fontSize: 8, color: '#666', textAlign: 'center', fontStyle: 'italic', marginTop: 2 },
  legendContainer: { padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  legendTitle: { fontWeight: 'bold', marginBottom: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', fontSize: 11, marginBottom: 3 },
  legendColorBox: { width: 14, height: 14, marginRight: 8, borderRadius: 3 },
  // Today's Plan styles
  todayViewContainer: { padding: 15, paddingBottom: 80 }, // Added paddingBottom for FAB
  timelineContainer: { borderLeftWidth: 3, borderColor: '#007AFF', paddingLeft: 20 },
  timelineItem: { position: 'relative', marginBottom: 15, padding: 15, backgroundColor: '#fff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginLeft: 15 },
  userTaskItem: { backgroundColor: '#E8F5E9' }, // Light green for user tasks
  timelineTime: { fontWeight: 'bold', color: '#007AFF', marginBottom: 5 },
  timelineSubject: { fontSize: 16, fontWeight: '600' },
  timelineDetails: { fontSize: 13, color: '#555', marginTop: 3 },
  fab: { position: 'absolute', bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabText: { fontSize: 30, color: 'white' },
  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { width: '100%', height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  timePickerButton: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  timePickerButtonText: {
    fontSize: 16
  },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { borderRadius: 10, padding: 15, elevation: 2, flex: 1, marginHorizontal: 5 },
  buttonClose: { backgroundColor: '#ccc' },
  buttonAdd: { backgroundColor: '#2196F3' },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
