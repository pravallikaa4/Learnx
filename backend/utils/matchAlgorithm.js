export const calculateMatchScore = (currentUser, otherUser) => {
  // 1. Initialize result structure
  let score = 0;
  let directMatches = [];
  let reverseMatches = [];
  let mutualSlots = [];

  // 2. Safely normalize skills
  const myToLearn = (currentUser.skillsToLearn || []).map(s => s.toLowerCase().trim());
  const myKnown = (currentUser.skillsKnown || []).map(s => s.toLowerCase().trim());
  const theirToLearn = (otherUser.skillsToLearn || []).map(s => s.toLowerCase().trim());
  const theirKnown = (otherUser.skillsKnown || []).map(s => s.toLowerCase().trim());

  // 3. Logic: You want what they know
  (otherUser.skillsKnown || []).forEach((skill) => {
    if (myToLearn.includes(skill.toLowerCase().trim())) {
      directMatches.push(skill);
      score += 10;
    }
  });

  // 4. Logic: They want what you know
  (otherUser.skillsToLearn || []).forEach((skill) => {
    if (myKnown.includes(skill.toLowerCase().trim())) {
      reverseMatches.push(skill);
      score += 10;
    }
  });

  // 🛑 If no skill overlap, return null
  if (directMatches.length === 0 && reverseMatches.length === 0) return null;

  // ⭐ 5. Add Knowledge Score bonus (mentor quality)
  if (otherUser.knowledgeScore) {
    score += otherUser.knowledgeScore;
  }

  // ⭐ Optional: Extra boost for expert mentors
  if (otherUser.expertiseLevel === "Expert") {
    score += 5;
  }

  // 6. Availability Matching
  const myAvail = currentUser.availability || [];
  const theirAvail = otherUser.availability || [];

  myAvail.forEach((myDay) => {
    const myDateStr = new Date(myDay.date).toDateString();

    theirAvail.forEach((theirDay) => {
      if (new Date(theirDay.date).toDateString() === myDateStr) {

        (myDay.timeSlots || []).forEach((slot) => {
          const cleanSlot = slot.trim();
          const theirSlots = (theirDay.timeSlots || []).map(s => s.trim());

          if (theirSlots.includes(cleanSlot)) {
            mutualSlots.push({ date: myDateStr, time: cleanSlot });
            score += 5;
          }

        });

      }
    });
  });

  return {
    score,
    directMatches,
    reverseMatches,
    matchedSkills: [...new Set([...directMatches, ...reverseMatches])],
    bestTime: mutualSlots.length > 0 ? mutualSlots[0] : null
  };
};