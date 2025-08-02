import React, { useState, useEffect, createContext, useContext } from 'react';
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
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Theme Management ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); 

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// --- Settings Management ---
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
    const [historyDuration, setHistoryDuration] = useState('month'); // 'day', 'week', 'month', 'forever'

    useEffect(() => {
        const loadSettings = async () => {
            const savedDuration = await AsyncStorage.getItem('historyDuration');
            if (savedDuration) {
                setHistoryDuration(savedDuration);
            }
        };
        loadSettings();
    }, []);

    const changeHistoryDuration = async (duration) => {
        setHistoryDuration(duration);
        await AsyncStorage.setItem('historyDuration', duration);
    };

    return (
        <SettingsContext.Provider value={{ historyDuration, changeHistoryDuration }}>
            {children}
        </SettingsContext.Provider>
    );
};

const useSettings = () => useContext(SettingsContext);


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
const getCellBackgroundColor = (subject, theme) => {
    const isDark = theme === 'dark';
    if (!subject) return isDark ? '#2C2C2E' : '#f0f0f0';
    if (subject === 'LUNCH') return isDark ? '#7A5A43' : '#FFDDC1';
    if (subject.includes('Microwave')) return isDark ? '#004D40' : '#D1F2EB';
    if (subject.includes('AI & ML')) return isDark ? '#8D6E63' : '#FCF3CF';
    if (subject.includes('Adv. Comm.')) return isDark ? '#4A148C' : '#E8DAEF';
    if (subject.includes('Control')) return isDark ? '#B71C1C' : '#FADBD8';
    if (subject.includes('Green Tech')) return isDark ? '#0D47A1' : '#D6EAF8';
    if (subject.includes('Cyber Security')) return isDark ? '#1B5E20' : '#D5F5E3';
    return isDark ? '#3A3A3C' : '#E5E7E9';
};

// --- Components ---
const TimetableView = () => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    return(
      <ScrollView style={{ flex: 1 }}>
        <ScrollView horizontal>
          <View>
            <View style={styles.row}>
              <View style={[styles.headerCell, styles.dayHeaderCell]}><Text style={styles.headerCellText}>Day/Time</Text></View>
              {timeSlots.map(time => (
                <View key={time} style={[styles.headerCell, styles.timeHeaderCell]}><Text style={styles.headerCellText}>{time}</Text></View>
              ))}
            </View>
            {days.map(day => (
              <View key={day} style={styles.row}>
                <View style={[styles.headerCell, styles.dayHeaderCell]}><Text style={styles.headerCellText}>{day}</Text></View>
                {timeSlots.map(time => {
                  const entry = routineData.find(e => e.day === day && e.time === time);
                  return (
                    <View key={`${day}-${time}`} style={[styles.cell, { backgroundColor: getCellBackgroundColor(entry?.subject, theme) }]}>
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
        <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Legend:</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('Microwave', theme)}]} /> Microwaves (EC55102) - Dr. Rajan Agrahari</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('AI & ML', theme)}]} /> AI & ML (EC55127) - Dr. Syed Shahnawazuddin</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('Adv. Comm.', theme)}]} /> Advanced Communications (EC55101) - Dr. Ajay Kumar Maurya</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('Control', theme)}]} /> Control Systems (EE55101) - Dr. Nishad Anwar</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('Green Tech', theme)}]} /> Green Tech (CH55102) - Dr. S. Das Gupta</Text>
            <Text style={styles.legendItem}><View style={[styles.legendColorBox, {backgroundColor: getCellBackgroundColor('Cyber Security', theme)}]} /> Cyber Security (OE-CSE) - CSE Faculty</Text>
        </View>
      </ScrollView>
    );
};

const TodayView = () => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [taskDesc, setTaskDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const todayKey = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const loadTasks = async () => {
            const storedTasks = await AsyncStorage.getItem(todayKey);
            if (storedTasks) setTasks(JSON.parse(storedTasks));
        };
        loadTasks();
    }, []);

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleAddTask = async () => {
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        if (!formattedTime || !taskDesc) return;
        const newTasks = [...tasks, { time: formattedTime, description: taskDesc }];
        setTasks(newTasks);
        await AsyncStorage.setItem(todayKey, JSON.stringify(newTasks));
        setModalVisible(false);
        setTaskDesc('');
    };

    const dayIndex = new Date().getDay();
    const todayName = (dayIndex > 0 && dayIndex < 6) ? days[dayIndex - 1] : null;
    const scheduledClasses = todayName ? routineData.filter(item => item.day === todayName && item.subject).map(item => ({...item, type: 'class', startTime: item.time.split(' - ')[0] })) : [];
    const userTasks = tasks.map(task => ({ ...task, type: 'user-task', startTime: task.time }));
    const allItems = [...scheduledClasses, ...userTasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.todayViewContainer}>
                <View style={styles.timelineContainer}>
                    {allItems.length === 0 ? (
                        <View style={styles.timelineItem}><Text style={styles.text}>No classes or tasks for today.</Text></View>
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
                        <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowPicker(true)}>
                            <Text style={styles.timePickerButtonText}>Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                        </TouchableOpacity>
                        {showPicker && <DateTimePicker testID="dateTimePicker" value={date} mode={'time'} is24Hour={true} display="default" onChange={onChangeTime} />}
                        <TextInput style={styles.input} placeholder="Task Description" placeholderTextColor={theme === 'dark' ? '#999' : '#ccc'} value={taskDesc} onChangeText={setTaskDesc} />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonAdd]} onPress={handleAddTask}><Text style={styles.buttonText}>Add</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const SettingsView = ({ onBack, onNavigate }) => {
    const { theme, toggleTheme } = useTheme();
    const { historyDuration, changeHistoryDuration } = useSettings();
    const styles = getStyles(theme);
    const isDark = theme === 'dark';
    const [pickerVisible, setPickerVisible] = useState(false);

    const historyOptions = [
        { label: '1 Day', value: 'day' },
        { label: '1 Week', value: 'week' },
        { label: '1 Month', value: 'month' },
        { label: 'Forever', value: 'forever' },
    ];

    const currentDurationLabel = historyOptions.find(opt => opt.value === historyDuration)?.label;

    return (
        <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>Settings</Text>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'Done'}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.settingsSection}>
                 <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDark ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleTheme}
                        value={isDark}
                    />
                </View>
            </View>

            <View style={styles.settingsSection}>
                <TouchableOpacity style={styles.settingRow} onPress={() => onNavigate('history')}>
                    <Text style={styles.settingText}>View Task History</Text>
                    <Text style={styles.arrowIcon}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow} onPress={() => setPickerVisible(true)}>
                    <Text style={styles.settingText}>Clear History After</Text>
                    <Text style={styles.durationText}>{currentDurationLabel}</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent={true} visible={pickerVisible}>
                <TouchableOpacity style={styles.modalContainer} onPress={() => setPickerVisible(false)}>
                    <View style={styles.pickerModalView}>
                        {historyOptions.map(opt => (
                            <TouchableOpacity key={opt.value} style={styles.pickerOption} onPress={() => { changeHistoryDuration(opt.value); setPickerVisible(false); }}>
                                <Text style={styles.pickerOptionText}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const HistoryView = ({ onBack }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const [history, setHistory] = useState({});

    useEffect(() => {
        const loadHistory = async () => {
            const allKeys = await AsyncStorage.getAllKeys();
            const taskKeys = allKeys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
            const historyData = {};
            for (const key of taskKeys) {
                const tasks = await AsyncStorage.getItem(key);
                if (tasks) {
                    historyData[key] = JSON.parse(tasks);
                }
            }
            setHistory(historyData);
        };
        loadHistory();
    }, []);

    const sortedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

    return (
        <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'< Settings'}</Text>
                </TouchableOpacity>
                <Text style={styles.settingsTitle}>Task History</Text>
            </View>
            <ScrollView contentContainerStyle={styles.todayViewContainer}>
                {sortedDates.length === 0 ? (
                    <Text style={styles.text}>No history found.</Text>
                ) : (
                    sortedDates.map(date => (
                        <View key={date} style={styles.historyDateSection}>
                            <Text style={styles.historyDateHeader}>{new Date(date).toDateString()}</Text>
                            {history[date].map((task, index) => (
                                <View key={index} style={styles.historyItem}>
                                    <Text style={styles.timelineTime}>{task.time}</Text>
                                    <Text style={styles.timelineSubject}>{task.description}</Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};


// --- Main App Component ---
const AppContent = () => {
  const { theme } = useTheme();
  const { historyDuration } = useSettings();
  const styles = getStyles(theme);
  const [activeView, setActiveView] = useState('timetable'); // timetable, today, settings, history

  useEffect(() => {
    const cleanupOldTasks = async () => {
        if (historyDuration === 'forever') return;

        const allKeys = await AsyncStorage.getAllKeys();
        const taskKeys = allKeys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let cutoffDate = new Date(today);
        if (historyDuration === 'day') {
            cutoffDate.setDate(today.getDate() - 1);
        } else if (historyDuration === 'week') {
            cutoffDate.setDate(today.getDate() - 7);
        } else if (historyDuration === 'month') {
            cutoffDate.setMonth(today.getMonth() - 1);
        }

        const keysToDelete = taskKeys.filter(key => {
            const taskDate = new Date(key);
            return taskDate < cutoffDate;
        });

        if (keysToDelete.length > 0) {
            await AsyncStorage.multiRemove(keysToDelete);
        }
    };
    cleanupOldTasks();
  }, [historyDuration]);

  const renderContent = () => {
    if (activeView === 'settings') {
      return <SettingsView onBack={() => setActiveView('timetable')} onNavigate={setActiveView} />;
    }
    if (activeView === 'history') {
        return <HistoryView onBack={() => setActiveView('settings')} />;
    }
    return (
      <>
        <View style={styles.nav}>
          <TouchableOpacity style={[styles.navButton, activeView === 'timetable' && styles.navButtonActive]} onPress={() => setActiveView('timetable')}>
            <Text style={[styles.navText, activeView === 'timetable' && styles.navTextActive]}>Weekly Timetable</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, activeView === 'today' && styles.navButtonActive]} onPress={() => setActiveView('today')}>
            <Text style={[styles.navText, activeView === 'today' && styles.navTextActive]}>Today's Plan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {activeView === 'timetable' ? <TimetableView /> : <TodayView />}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
            <Text style={styles.headerText}>ECE Dept. Timetable</Text>
            <Text style={styles.subHeaderText}>UG 5th Semester | Jul-Dec 2025</Text>
        </View>
        <TouchableOpacity style={styles.headerSide} onPress={() => setActiveView('settings')}>
            <View style={styles.hamburgerIcon}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
            </View>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    </ThemeProvider>
  );
}

// --- Dynamic Styles ---
const getStyles = (theme) => {
    const isDark = theme === 'dark';
    const colors = {
        background: isDark ? '#121212' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#000000',
        primary: '#007AFF',
        header: isDark ? '#1C1C1E' : '#FFFFFF',
        container: isDark ? '#000000' : '#f9f9f9',
        nav: isDark ? '#1C1C1E' : '#F8F8F8',
        navText: isDark ? '#E5E5EA' : '#333333',
        navTextActive: '#007AFF',
        cellBorder: isDark ? '#3A3A3C' : '#DDDDDD',
        headerCellBg: isDark ? '#2C2C2E' : '#f2f2f2',
        timelineItemBg: isDark ? '#1C1C1E' : '#FFFFFF',
        userTaskItemBg: isDark ? '#1B5E20' : '#E8F5E9',
        modalBg: isDark ? '#2C2C2E' : '#FFFFFF',
        inputBg: isDark ? '#3A3A3C' : '#FFFFFF',
        inputText: isDark ? '#FFFFFF' : '#000000',
        buttonClose: isDark ? '#555' : '#ccc',
    };

    return StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.header, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderColor: colors.cellBorder, backgroundColor: colors.header },
        headerCenter: { flex: 1, alignItems: 'center' },
        headerSide: { width: 30, alignItems: 'center' },
        headerText: { fontSize: 20, fontWeight: 'bold', color: colors.text },
        subHeaderText: { fontSize: 14, color: colors.text },
        hamburgerIcon: { justifyContent: 'space-around', width: 24, height: 18 },
        hamburgerLine: { height: 2, backgroundColor: colors.text, width: '100%' },
        nav: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.cellBorder, backgroundColor: colors.nav },
        navButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
        navButtonActive: { borderBottomWidth: 3, borderColor: colors.primary },
        navText: { fontSize: 16, color: colors.navText },
        navTextActive: { color: colors.navTextActive, fontWeight: 'bold' },
        container: { flex: 1, backgroundColor: colors.container },
        row: { flexDirection: 'row' },
        headerCell: { padding: 8, borderWidth: 1, borderColor: colors.cellBorder, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.headerCellBg },
        dayHeaderCell: { width: 90 },
        timeHeaderCell: { width: 110 },
        headerCellText: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: colors.text },
        cell: { width: 110, height: 90, borderWidth: 1, borderColor: colors.cellBorder, padding: 4, justifyContent: 'center', alignItems: 'center' },
        cellSubject: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: colors.text },
        cellProfessor: { fontSize: 9, color: colors.text, textAlign: 'center', marginTop: 2 },
        cellLocation: { fontSize: 8, color: colors.text, textAlign: 'center', fontStyle: 'italic', marginTop: 2 },
        legendContainer: { padding: 10, borderTopWidth: 1, borderColor: colors.cellBorder, backgroundColor: colors.header },
        legendTitle: { fontWeight: 'bold', marginBottom: 5, color: colors.text },
        legendItem: { flexDirection: 'row', alignItems: 'center', fontSize: 11, marginBottom: 3, color: colors.text },
        legendColorBox: { width: 14, height: 14, marginRight: 8, borderRadius: 3 },
        todayViewContainer: { padding: 15, paddingBottom: 80 },
        timelineContainer: { borderLeftWidth: 3, borderColor: colors.primary, paddingLeft: 20 },
        timelineItem: { position: 'relative', marginBottom: 15, padding: 15, backgroundColor: colors.timelineItemBg, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, marginLeft: 15 },
        userTaskItem: { backgroundColor: colors.userTaskItemBg },
        timelineTime: { fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
        timelineSubject: { fontSize: 16, fontWeight: '600', color: colors.text },
        timelineDetails: { fontSize: 13, color: colors.text, marginTop: 3 },
        fab: { position: 'absolute', bottom: 25, right: 25, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
        fabText: { fontSize: 30, color: 'white' },
        modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
        modalView: { width: '85%', backgroundColor: colors.modalBg, borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
        modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: colors.text },
        input: { width: '100%', height: 50, borderColor: colors.cellBorder, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: colors.inputBg, color: colors.inputText },
        timePickerButton: { width: '100%', height: 50, borderColor: colors.cellBorder, borderWidth: 1, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 15, marginBottom: 15, backgroundColor: colors.inputBg },
        timePickerButtonText: { fontSize: 16, color: colors.text },
        modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
        button: { borderRadius: 10, padding: 15, elevation: 2, flex: 1, marginHorizontal: 5 },
        buttonClose: { backgroundColor: colors.buttonClose },
        buttonAdd: { backgroundColor: '#2196F3' },
        buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
        text: { color: colors.text },
        // Settings View
        settingsContainer: { flex: 1, backgroundColor: colors.container },
        settingsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: colors.cellBorder, backgroundColor: colors.header },
        backButton: { padding: 5 },
        backButtonText: { fontSize: 16, color: colors.primary, fontWeight: 'bold' },
        settingsTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
        settingsSection: { marginTop: 20, marginHorizontal: 10, backgroundColor: colors.timelineItemBg, borderRadius: 10 },
        themeOptionsHeader: { fontSize: 14, color: '#888', padding: 15, paddingBottom: 5 },
        settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: colors.cellBorder },
        settingText: { fontSize: 18, color: colors.text },
        arrowIcon: { fontSize: 18, color: '#888' },
        durationText: { fontSize: 16, color: '#888' },
        checkMark: { fontSize: 18, color: colors.primary },
        pickerModalView: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.modalBg, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
        pickerOption: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.cellBorder },
        pickerOptionText: { fontSize: 18, color: colors.primary },
        // History View
        historyDateSection: { marginBottom: 20 },
        historyDateHeader: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: colors.cellBorder },
        historyItem: { padding: 10, backgroundColor: colors.timelineItemBg, borderRadius: 5, marginBottom: 5 },
    });
};
