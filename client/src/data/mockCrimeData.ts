import { CrimeIncident } from '@shared/schema';

// Mock crime data for Lucknow, India
// TODO: remove mock functionality when integrating with real API
export const mockCrimeData: CrimeIncident[] = [
  // Hazratganj area
  { id: '1', lat: '26.8500', lng: '80.9500', type: 'Theft', severity: 3, date: '2024-08-15', description: 'A purse was snatched near Hazratganj market.' },
  { id: '2', lat: '26.8510', lng: '80.9490', type: 'Vandalism', severity: 2, date: '2024-08-20', description: 'Graffiti found on public property near GPO.' },
  { id: '3', lat: '26.8485', lng: '80.9515', type: 'Assault', severity: 6, date: '2024-07-28', description: 'Minor altercation reported outside shopping complex.' },
  
  // Gomti Nagar area
  { id: '4', lat: '26.8950', lng: '81.0150', type: 'Burglary', severity: 7, date: '2024-08-10', description: 'Break-in reported at residential complex in Gomti Nagar.' },
  { id: '5', lat: '26.8965', lng: '81.0175', type: 'Theft', severity: 4, date: '2024-08-25', description: 'Motorcycle theft from parking area.' },
  { id: '6', lat: '26.8940', lng: '81.0165', type: 'Vandalism', severity: 1, date: '2024-08-18', description: 'Minor property damage in residential area.' },
  
  // Indira Nagar area
  { id: '7', lat: '26.8650', lng: '80.9750', type: 'Robbery', severity: 8, date: '2024-07-30', description: 'Armed robbery reported near bank in Indira Nagar.' },
  { id: '8', lat: '26.8655', lng: '80.9745', type: 'Theft', severity: 5, date: '2024-08-05', description: 'Wallet stolen from public transport.' },
  { id: '9', lat: '26.8670', lng: '80.9760', type: 'Assault', severity: 4, date: '2024-08-12', description: 'Verbal altercation escalated to minor physical confrontation.' },
  
  // Aminabad area
  { id: '10', lat: '26.8400', lng: '80.9200', type: 'Theft', severity: 6, date: '2024-08-22', description: 'Pickpocketing incident in crowded market area.' },
  { id: '11', lat: '26.8415', lng: '80.9185', type: 'Burglary', severity: 5, date: '2024-07-15', description: 'Shop break-in during night hours.' },
  { id: '12', lat: '26.8395', lng: '80.9210', type: 'Vandalism', severity: 2, date: '2024-08-08', description: 'Street vendor stall damaged overnight.' },
  
  // Alambagh area
  { id: '13', lat: '26.8100', lng: '80.8850', type: 'Assault', severity: 7, date: '2024-07-25', description: 'Serious altercation near bus terminal.' },
  { id: '14', lat: '26.8115', lng: '80.8865', type: 'Theft', severity: 3, date: '2024-08-17', description: 'Mobile phone snatched near railway crossing.' },
  { id: '15', lat: '26.8095', lng: '80.8840', type: 'Robbery', severity: 9, date: '2024-07-20', description: 'Multiple victims robbed at knife-point.' },
  
  // Chowk area
  { id: '16', lat: '26.8520', lng: '80.9100', type: 'Theft', severity: 4, date: '2024-08-14', description: 'Bicycle theft from market area.' },
  { id: '17', lat: '26.8535', lng: '80.9115', type: 'Vandalism', severity: 3, date: '2024-08-21', description: 'Public property damaged in narrow lanes.' },
  { id: '18', lat: '26.8505', lng: '80.9085', type: 'Burglary', severity: 6, date: '2024-07-18', description: 'Traditional jewelry shop burgled.' },
  
  // Mahanagar area
  { id: '19', lat: '26.8800', lng: '80.9900', type: 'Assault', severity: 5, date: '2024-08-03', description: 'Road rage incident turned violent.' },
  { id: '20', lat: '26.8815', lng: '80.9885', type: 'Theft', severity: 2, date: '2024-08-26', description: 'Minor theft from parked vehicle.' },
  { id: '21', lat: '26.8785', lng: '80.9915', type: 'Vandalism', severity: 1, date: '2024-08-19', description: 'Garden plants damaged in residential area.' },
  
  // Aliganj area
  { id: '22', lat: '26.9100', lng: '80.9600', type: 'Burglary', severity: 8, date: '2024-07-22', description: 'House burglary when family was away.' },
  { id: '23', lat: '26.9115', lng: '80.9585', type: 'Theft', severity: 4, date: '2024-08-09', description: 'Purse snatching near school area.' },
  { id: '24', lat: '26.9085', lng: '80.9615', type: 'Robbery', severity: 7, date: '2024-07-27', description: 'Evening robbery of pedestrian.' },
  
  // Nishatganj area
  { id: '25', lat: '26.8350', lng: '80.9350', type: 'Theft', severity: 3, date: '2024-08-16', description: 'Auto-rickshaw theft from parking.' },
  { id: '26', lat: '26.8365', lng: '80.9335', type: 'Assault', severity: 4, date: '2024-08-06', description: 'Dispute over parking space escalated.' },
  { id: '27', lat: '26.8340', lng: '80.9365', type: 'Vandalism', severity: 2, date: '2024-08-23', description: 'Street lights damaged overnight.' },
  
  // Additional scattered incidents across Lucknow
  { id: '28', lat: '26.8700', lng: '80.9300', type: 'Theft', severity: 5, date: '2024-08-11', description: 'Electronics stolen from office building.' },
  { id: '29', lat: '26.8750', lng: '80.9650', type: 'Burglary', severity: 6, date: '2024-07-24', description: 'Apartment break-in during daytime.' },
  { id: '30', lat: '26.8450', lng: '80.9450', type: 'Assault', severity: 3, date: '2024-08-07', description: 'Minor scuffle outside restaurant.' },
  { id: '31', lat: '26.8600', lng: '80.9200', type: 'Robbery', severity: 8, date: '2024-07-19', description: 'Cash robbery from small business.' },
  { id: '32', lat: '26.8300', lng: '80.9000', type: 'Vandalism', severity: 1, date: '2024-08-24', description: 'Public bench damaged in park.' },
  { id: '33', lat: '26.8900', lng: '80.9800', type: 'Theft', severity: 4, date: '2024-08-13', description: 'Laptop bag stolen from car.' },
  { id: '34', lat: '26.8550', lng: '80.9550', type: 'Assault', severity: 6, date: '2024-07-26', description: 'Physical altercation near college campus.' },
  { id: '35', lat: '26.8250', lng: '80.9250', type: 'Burglary', severity: 7, date: '2024-07-21', description: 'Medical shop burgled at night.' },
  { id: '36', lat: '26.8850', lng: '80.9450', type: 'Theft', severity: 2, date: '2024-08-27', description: 'Small amount cash stolen from vendor.' },
  { id: '37', lat: '26.8750', lng: '80.9150', type: 'Vandalism', severity: 3, date: '2024-08-04', description: 'Bus stop shelter damaged by vandals.' },
  { id: '38', lat: '26.8950', lng: '80.9950', type: 'Robbery', severity: 9, date: '2024-07-17', description: 'Armed robbery at ATM location.' },
  { id: '39', lat: '26.8200', lng: '80.8950', type: 'Assault', severity: 5, date: '2024-08-01', description: 'Domestic dispute spilled into street.' },
  { id: '40', lat: '26.8650', lng: '80.9850', type: 'Theft', severity: 3, date: '2024-08-28', description: 'Fruit vendor cart items stolen.' },
  
  // More incidents for better data distribution
  { id: '41', lat: '26.8480', lng: '80.9320', type: 'Burglary', severity: 5, date: '2024-07-16', description: 'Small office burgled during weekend.' },
  { id: '42', lat: '26.8720', lng: '80.9680', type: 'Vandalism', severity: 2, date: '2024-08-29', description: 'Flower pots broken in residential area.' },
  { id: '43', lat: '26.8380', lng: '80.9180', type: 'Theft', severity: 6, date: '2024-07-23', description: 'Gold chain snatching incident.' },
  { id: '44', lat: '26.8820', lng: '80.9420', type: 'Assault', severity: 4, date: '2024-08-02', description: 'Bar fight that moved to street.' },
  { id: '45', lat: '26.8150', lng: '80.8900', type: 'Robbery', severity: 7, date: '2024-07-14', description: 'Evening mugging of elderly person.' },
  { id: '46', lat: '26.8580', lng: '80.9580', type: 'Theft', severity: 3, date: '2024-08-30', description: 'Umbrella stolen from tea stall.' },
  { id: '47', lat: '26.8750', lng: '80.9250', type: 'Vandalism', severity: 1, date: '2024-08-31', description: 'Graffiti on newly painted wall.' },
  { id: '48', lat: '26.8420', lng: '80.9520', type: 'Burglary', severity: 8, date: '2024-07-12', description: 'Electronics shop major theft.' },
  { id: '49', lat: '26.8680', lng: '80.9120', type: 'Assault', severity: 6, date: '2024-07-29', description: 'Heated argument turned physical.' },
  { id: '50', lat: '26.8320', lng: '80.9420', type: 'Theft', severity: 4, date: '2024-08-15', description: 'Shopping bag stolen from market.' },
];

// Additional 50+ incidents for comprehensive data
export const additionalCrimeData: CrimeIncident[] = [
  // More Hazratganj incidents
  { id: '51', lat: '26.8520', lng: '80.9480', type: 'Theft', severity: 2, date: '2024-06-15', description: 'Small theft from street vendor.' },
  { id: '52', lat: '26.8495', lng: '80.9505', type: 'Vandalism', severity: 3, date: '2024-06-20', description: 'Public phone booth damaged.' },
  { id: '53', lat: '26.8475', lng: '80.9525', type: 'Assault', severity: 5, date: '2024-06-25', description: 'Customer dispute at store.' },
  { id: '54', lat: '26.8515', lng: '80.9485', type: 'Burglary', severity: 6, date: '2024-06-10', description: 'Small shop burgled overnight.' },
  { id: '55', lat: '26.8505', lng: '80.9495', type: 'Robbery', severity: 7, date: '2024-06-30', description: 'Handbag robbery in busy area.' },
  
  // More Gomti Nagar incidents
  { id: '56', lat: '26.8955', lng: '81.0155', type: 'Theft', severity: 3, date: '2024-06-18', description: 'Bicycle theft from apartment complex.' },
  { id: '57', lat: '26.8945', lng: '81.0145', type: 'Vandalism', severity: 1, date: '2024-06-22', description: 'Children playground equipment damaged.' },
  { id: '58', lat: '26.8960', lng: '81.0160', type: 'Assault', severity: 4, date: '2024-06-27', description: 'Parking dispute escalation.' },
  { id: '59', lat: '26.8970', lng: '81.0170', type: 'Burglary', severity: 8, date: '2024-06-05', description: 'Major home burglary during vacation.' },
  { id: '60', lat: '26.8935', lng: '81.0140', type: 'Theft', severity: 4, date: '2024-06-28', description: 'Car accessories stolen.' },
  
  // More Indira Nagar incidents
  { id: '61', lat: '26.8645', lng: '80.9755', type: 'Vandalism', severity: 2, date: '2024-06-12', description: 'Street signs damaged by miscreants.' },
  { id: '62', lat: '26.8665', lng: '80.9740', type: 'Theft', severity: 5, date: '2024-06-17', description: 'Mobile phone theft on public transport.' },
  { id: '63', lat: '26.8675', lng: '80.9765', type: 'Assault', severity: 6, date: '2024-06-23', description: 'Road rage incident near market.' },
  { id: '64', lat: '26.8640', lng: '80.9750', type: 'Burglary', severity: 7, date: '2024-06-08', description: 'Office burglary during weekend.' },
  { id: '65', lat: '26.8660', lng: '80.9755', type: 'Robbery', severity: 8, date: '2024-06-14', description: 'ATM area robbery late night.' },
  
  // Continue with more areas and incidents...
  { id: '66', lat: '26.8405', lng: '80.9195', type: 'Theft', severity: 3, date: '2024-06-21', description: 'Vegetable vendor cart raided.' },
  { id: '67', lat: '26.8410', lng: '80.9190', type: 'Vandalism', severity: 2, date: '2024-06-26', description: 'Market stall covers torn.' },
  { id: '68', lat: '26.8390', lng: '80.9205', type: 'Assault', severity: 4, date: '2024-06-11', description: 'Customer-shopkeeper dispute.' },
  { id: '69', lat: '26.8420', lng: '80.9180', type: 'Burglary', severity: 6, date: '2024-06-16', description: 'Textile shop night burglary.' },
  { id: '70', lat: '26.8400', lng: '80.9200', type: 'Robbery', severity: 9, date: '2024-06-06', description: 'Serious robbery with weapon.' },
  
  // Additional scattered incidents
  { id: '71', lat: '26.8600', lng: '80.9400', type: 'Theft', severity: 2, date: '2024-05-15', description: 'Minor theft from parked scooter.' },
  { id: '72', lat: '26.8700', lng: '80.9500', type: 'Vandalism', severity: 1, date: '2024-05-20', description: 'Tree branch broken maliciously.' },
  { id: '73', lat: '26.8800', lng: '80.9600', type: 'Assault', severity: 3, date: '2024-05-25', description: 'Minor altercation at bus stop.' },
  { id: '74', lat: '26.8550', lng: '80.9350', type: 'Burglary', severity: 5, date: '2024-05-10', description: 'Small business break-in.' },
  { id: '75', lat: '26.8650', lng: '80.9450', type: 'Theft', severity: 4, date: '2024-05-28', description: 'Wallet pickpocketed in crowd.' },
  { id: '76', lat: '26.8750', lng: '80.9550', type: 'Robbery', severity: 7, date: '2024-05-18', description: 'Evening street robbery.' },
  { id: '77', lat: '26.8450', lng: '80.9250', type: 'Vandalism', severity: 3, date: '2024-05-22', description: 'Public property defaced.' },
  { id: '78', lat: '26.8850', lng: '80.9750', type: 'Assault', severity: 5, date: '2024-05-27', description: 'Neighborhood dispute turned violent.' },
  { id: '79', lat: '26.8350', lng: '80.9150', type: 'Theft', severity: 3, date: '2024-05-12', description: 'Grocery items stolen from shop.' },
  { id: '80', lat: '26.8950', lng: '80.9850', type: 'Burglary', severity: 8, date: '2024-05-16', description: 'Apartment complex major theft.' },
  
  // Final batch of incidents
  { id: '81', lat: '26.8250', lng: '80.9050', type: 'Vandalism', severity: 2, date: '2024-05-21', description: 'School wall graffiti.' },
  { id: '82', lat: '26.8900', lng: '80.9700', type: 'Theft', severity: 4, date: '2024-05-26', description: 'Construction material stolen.' },
  { id: '83', lat: '26.8400', lng: '80.9300', type: 'Assault', severity: 6, date: '2024-05-11', description: 'Bar fight spillover to street.' },
  { id: '84', lat: '26.8800', lng: '80.9200', type: 'Robbery', severity: 7, date: '2024-05-17', description: 'Cash transport robbery attempt.' },
  { id: '85', lat: '26.8500', lng: '80.9600', type: 'Burglary', severity: 5, date: '2024-05-23', description: 'Pharmacy break-in for medicines.' },
  { id: '86', lat: '26.8700', lng: '80.9800', type: 'Theft', severity: 2, date: '2024-05-29', description: 'Street food cart items stolen.' },
  { id: '87', lat: '26.8300', lng: '80.9400', type: 'Vandalism', severity: 1, date: '2024-05-13', description: 'Park bench damaged by kids.' },
  { id: '88', lat: '26.8600', lng: '80.9100', type: 'Assault', severity: 4, date: '2024-05-19', description: 'Traffic dispute escalation.' },
  { id: '89', lat: '26.8750', lng: '80.9350', type: 'Theft', severity: 3, date: '2024-05-24', description: 'Clothes stolen from washing line.' },
  { id: '90', lat: '26.8850', lng: '80.9250', type: 'Robbery', severity: 8, date: '2024-05-14', description: 'Serious robbery at jewelery store.' },
  
  // Additional 20 more for over 100 total
  { id: '91', lat: '26.8480', lng: '80.9380', type: 'Theft', severity: 1, date: '2024-04-15', description: 'Newspaper stolen from doorstep.' },
  { id: '92', lat: '26.8520', lng: '80.9420', type: 'Vandalism', severity: 2, date: '2024-04-20', description: 'Mailbox damaged intentionally.' },
  { id: '93', lat: '26.8580', lng: '80.9480', type: 'Assault', severity: 3, date: '2024-04-25', description: 'Mild altercation over queue jumping.' },
  { id: '94', lat: '26.8620', lng: '80.9520', type: 'Burglary', severity: 4, date: '2024-04-10', description: 'Small clinic burgled for supplies.' },
  { id: '95', lat: '26.8660', lng: '80.9560', type: 'Theft', severity: 5, date: '2024-04-28', description: 'Expensive watch stolen at gunpoint.' },
  { id: '96', lat: '26.8720', lng: '80.9620', type: 'Robbery', severity: 6, date: '2024-04-18', description: 'Cash robbery from local business.' },
  { id: '97', lat: '26.8780', lng: '80.9680', type: 'Vandalism', severity: 3, date: '2024-04-22', description: 'Car windows broken in parking.' },
  { id: '98', lat: '26.8820', lng: '80.9720', type: 'Assault', severity: 7, date: '2024-04-27', description: 'Serious assault near hospital.' },
  { id: '99', lat: '26.8380', lng: '80.9280', type: 'Theft', severity: 2, date: '2024-04-12', description: 'Small change stolen from tip jar.' },
  { id: '100', lat: '26.8940', lng: '80.9840', type: 'Burglary', severity: 9, date: '2024-04-16', description: 'Major residential burglary with violence threat.' },
];

// Combine all crime data
export const allCrimeData: CrimeIncident[] = [...mockCrimeData, ...additionalCrimeData];