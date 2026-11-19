/**
 * Mock profiles for the Discover feed.
 *
 * `likesYou` is SERVER-ONLY data: it says whether this person has already
 * liked the logged-in user. It must never leave the server except through a
 * mutual match (see lib/publicProfile.js). The likers are deliberately spread
 * through the list so that feed order says nothing about who liked you.
 */
export const SEED_PROFILES = [
  { id: 'p01', name: 'Aarav', age: 22, city: 'Bengaluru', college: 'IISc Bangalore', bio: 'Builds tiny robots, breaks bigger ones. Looking for someone to judge my chai-making skills.', interests: ['Robotics', 'Chai', 'Indie music'], likesYou: false },
  { id: 'p02', name: 'Ananya', age: 21, city: 'Pune', college: 'COEP Pune', bio: 'Sunrise trekker, sunset reader. Will absolutely make you a playlist.', interests: ['Trekking', 'Books', 'Playlists'], likesYou: false },
  { id: 'p03', name: 'Ishaan', age: 23, city: 'Delhi', college: 'DTU', bio: 'Part-time coder, full-time foodie. Ask me about the best momos in North Campus.', interests: ['Coding', 'Street food', 'Football'], likesYou: true },
  { id: 'p04', name: 'Diya', age: 20, city: 'Kolkata', college: 'Jadavpur University', bio: 'Rabindra Sangeet in the morning, K-pop by night. Contradictions are my personality.', interests: ['Music', 'K-dramas', 'Sketching'], likesYou: false },
  { id: 'p05', name: 'Kabir', age: 24, city: 'Mumbai', college: 'IIT Bombay', bio: 'Marine Drive walks > everything. I make a mean Maggi at 2 am.', interests: ['Running', 'Photography', 'Startups'], likesYou: false },
  { id: 'p06', name: 'Meera', age: 22, city: 'Chennai', college: 'IIT Madras', bio: 'Bharatanatyam dancer who also debugs Python. Filter coffee or nothing.', interests: ['Dance', 'Python', 'Filter coffee'], likesYou: false },
  { id: 'p07', name: 'Rohan', age: 21, city: 'Dhanbad', college: 'IIT (ISM) Dhanbad', bio: 'Mining engineering by degree, guitar by choice. Always up for a Topchanchi lake trip.', interests: ['Guitar', 'Road trips', 'Cricket'], likesYou: true },
  { id: 'p08', name: 'Saanvi', age: 23, city: 'Hyderabad', college: 'IIIT Hyderabad', bio: 'Researching NLP, still can’t understand my own handwriting.', interests: ['AI', 'Biryani', 'Board games'], likesYou: false },
  { id: 'p09', name: 'Vihaan', age: 25, city: 'Ahmedabad', college: 'NID Ahmedabad', bio: 'Product designer. I will notice your font choices.', interests: ['Design', 'Cycling', 'Typography'], likesYou: false },
  { id: 'p10', name: 'Aisha', age: 22, city: 'Lucknow', college: 'Lucknow University', bio: 'Poetry, kebabs and long conversations about nothing in particular.', interests: ['Urdu poetry', 'Food walks', 'Theatre'], likesYou: false },
  { id: 'p11', name: 'Arjun', age: 22, city: 'Ranchi', college: 'BIT Mesra', bio: 'Electronics nerd. Will explain op-amps on the first date if you let me.', interests: ['Electronics', 'Badminton', 'Anime'], likesYou: true },
  { id: 'p12', name: 'Kavya', age: 20, city: 'Jaipur', college: 'MNIT Jaipur', bio: 'Hawa Mahal tour guide (unofficial). Professional overthinker.', interests: ['History', 'Journaling', 'Baking'], likesYou: false },
  { id: 'p13', name: 'Aditya', age: 24, city: 'Bengaluru', college: 'RV College of Engineering', bio: 'Backend dev who refuses to touch CSS. Weekend Nandi Hills regular.', interests: ['Backend', 'Hiking', 'Coffee'], likesYou: false },
  { id: 'p14', name: 'Riya', age: 21, city: 'Bhubaneswar', college: 'KIIT', bio: 'Debate club captain. I’ll argue either side, just pick one.', interests: ['Debating', 'Swimming', 'Podcasts'], likesYou: true },
  { id: 'p15', name: 'Vivaan', age: 23, city: 'Chandigarh', college: 'PEC Chandigarh', bio: 'Gym in the morning, parathas at night. Balance.', interests: ['Fitness', 'Punjabi music', 'Cars'], likesYou: false },
  { id: 'p16', name: 'Tara', age: 22, city: 'Goa', college: 'BITS Pilani, Goa', bio: 'Beach cleanup volunteer and amateur surfer. Sunscreen evangelist.', interests: ['Surfing', 'Sustainability', 'Ukulele'], likesYou: false },
  { id: 'p17', name: 'Reyansh', age: 20, city: 'Patna', college: 'NIT Patna', bio: 'Chess blitz addict. I resign gracefully, mostly.', interests: ['Chess', 'Litti chokha', 'Sci-fi'], likesYou: false },
  { id: 'p18', name: 'Nisha', age: 23, city: 'Indore', college: 'IIM Indore', bio: 'Spreadsheet wizard with a soft spot for poha and stand-up comedy.', interests: ['Finance', 'Stand-up', 'Poha'], likesYou: true },
  { id: 'p19', name: 'Krish', age: 22, city: 'Surat', college: 'SVNIT Surat', bio: 'Textile family, tech dreams. Garba champion of 2023 (self-declared).', interests: ['Garba', 'Web dev', 'Movies'], likesYou: false },
  { id: 'p20', name: 'Pooja', age: 24, city: 'Kochi', college: 'CUSAT', bio: 'Marine biology student. I will tell you fun facts about octopuses.', interests: ['Marine life', 'Kayaking', 'Cooking'], likesYou: false },
  { id: 'p21', name: 'Aryan', age: 21, city: 'Guwahati', college: 'IIT Guwahati', bio: 'Brahmaputra sunsets and late-night hackathons.', interests: ['Hackathons', 'Football', 'Photography'], likesYou: false },
  { id: 'p22', name: 'Sneha', age: 22, city: 'Jamshedpur', college: 'NIT Jamshedpur', bio: 'Jubilee Park morning runs. Fluent in sarcasm and Hindi film references.', interests: ['Running', 'Bollywood', 'Painting'], likesYou: true },
  { id: 'p23', name: 'Dev', age: 25, city: 'Noida', college: 'Amity University', bio: 'Product manager. I write PRDs for my weekend plans.', interests: ['Product', 'Tennis', 'Travel'], likesYou: false },
  { id: 'p24', name: 'Ira', age: 20, city: 'Mysuru', college: 'University of Mysore', bio: 'Plant mom with 23 plants and counting. Each one has a name.', interests: ['Plants', 'Yoga', 'Pottery'], likesYou: false },
  { id: 'p25', name: 'Yash', age: 23, city: 'Nagpur', college: 'VNIT Nagpur', bio: 'Orange city native. Will defend Nagpur’s santra barfi with my life.', interests: ['Gaming', 'Cricket', 'Desserts'], likesYou: false },
  { id: 'p26', name: 'Anika', age: 21, city: 'Varanasi', college: 'IIT (BHU) Varanasi', bio: 'Ghats at dawn, code at dusk. Looking for a boat-ride buddy.', interests: ['Classical music', 'Coding', 'Photography'], likesYou: true },
  { id: 'p27', name: 'Sai', age: 22, city: 'Vijayawada', college: 'VIT-AP', bio: 'Telugu cinema expert. Yes, I have opinions about every remake.', interests: ['Cinema', 'Cricket', 'Spicy food'], likesYou: false },
  { id: 'p28', name: 'Zara', age: 23, city: 'Srinagar', college: 'NIT Srinagar', bio: 'Kahwa enthusiast, mountain person, terrible at small talk but great at long talk.', interests: ['Mountains', 'Writing', 'Kahwa'], likesYou: false },
  { id: 'p29', name: 'Laksh', age: 24, city: 'Bhopal', college: 'MANIT Bhopal', bio: 'Lake city cyclist. Building a startup that may or may not exist next month.', interests: ['Startups', 'Cycling', 'Jazz'], likesYou: false },
  { id: 'p30', name: 'Myra', age: 22, city: 'Bengaluru', college: 'Christ University', bio: 'Psychology major. I promise I’m not analysing you. Much.', interests: ['Psychology', 'Concerts', 'Thrifting'], likesYou: true },
  { id: 'p31', name: 'Neel', age: 21, city: 'Kharagpur', college: 'IIT Kharagpur', bio: 'Spring Fest volunteer, quiz team regular. I know useless facts.', interests: ['Quizzing', 'Astronomy', 'Biryani'], likesYou: false },
  { id: 'p32', name: 'Tanvi', age: 20, city: 'Dehradun', college: 'UPES Dehradun', bio: 'Weekend Mussoorie runs and maggi points. Dog person, strongly.', interests: ['Dogs', 'Hiking', 'Photography'], likesYou: false },
].map((p) => ({ ...p, photo: `/avatars/${p.id}.svg` }));

export const PROFILES_BY_ID = new Map(SEED_PROFILES.map((p) => [p.id, p]));
