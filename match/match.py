from datetime import datetime

def calculate_match_score(current_user, other_user):
    score = 0
    direct_matches = []
    reverse_matches = []
    mutual_slots = []

    # 1️⃣ User A wants what User B knows
    for skill in (other_user.get('skillsKnown') or []):
        if skill in (current_user.get('skillsToLearn') or []):
            direct_matches.append(skill)
            score += 10

    # 2️⃣ User B wants what User A knows
    for skill in (other_user.get('skillsToLearn') or []):
        if skill in (current_user.get('skillsKnown') or []):
            reverse_matches.append(skill)
            score += 10

    # 3️⃣ Bonus for exchange
    if direct_matches and reverse_matches:
        score += 20

    # 4️⃣ Availability
    for my_day in (current_user.get('availability') or []):
        for their_day in (other_user.get('availability') or []):
            # Normalizing dates for comparison
            my_date = datetime.fromisoformat(my_day['date'].replace('Z', '')).date()
            their_date = datetime.fromisoformat(their_day['date'].replace('Z', '')).date()

            if my_date == their_date:
                for slot in (my_day.get('timeSlots') or []):
                    clean_slot = slot.strip()
                    if any(ts.strip() == clean_slot for ts in (their_day.get('timeSlots') or [])):
                        mutual_slots.append({
                            "date": str(my_date),
                            "time": clean_slot
                        })
                        score += 5

    best_time = mutual_slots[0] if mutual_slots else None

    return {
        "score": score,
        "directMatches": direct_matches,
        "reverseMatches": reverse_matches,
        "matchedSkills": list(set(direct_matches + reverse_matches)),
        "bestTime": best_time,
        "mutualSlots": mutual_slots
    }