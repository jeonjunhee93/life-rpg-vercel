import { useState } from "react";
import { motion } from "framer-motion";

export default function LifeRPG() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    gold: 0,
    inventory: [],
    stats: {
      strength: 5,
      intelligence: 5,
      luck: 5
    },
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
      helmet: null,
      boots: null,
      gloves: null,
      ring: null,
      cloak: null,
      belt: null,
      shield: null
    }
  });

  const lootTable = [
    { name: "🗡 이빨 빠진 철검", type: "weapon", stat: { strength: 1 }, grade: "하급" },
    { name: "👕 낡아빠진 천갑옷", type: "armor", stat: { strength: 0 }, grade: "하급" },
    { name: "💍 긁힌 은반지", type: "ring", stat: { luck: 1 }, grade: "하급" },
    { name: "🎓 낡은 모자", type: "helmet", stat: { intelligence: 1 }, grade: "하급" },
    { name: "🥾 낡은 신발", type: "boots", stat: { strength: 0 }, grade: "하급" },
    { name: "🧤 해어진 장갑", type: "gloves", stat: { strength: 0 }, grade: "하급" },
    { name: "🧥 헤진 망토", type: "cloak", stat: { luck: 0 }, grade: "하급" },
    { name: "🔗 녹슨 허리띠", type: "belt", stat: { strength: 0 }, grade: "하급" },
    { name: "🛡 금 간 방패", type: "shield", stat: { strength: 1 }, grade: "하급" },
    { name: "📕 해진 책자", type: "accessory", stat: { intelligence: 1 }, grade: "하급" },
    { name: "🗡 견고한 강철검", type: "weapon", stat: { strength: 3 }, grade: "중급" },
    { name: "👕 튼튼한 가죽갑옷", type: "armor", stat: { strength: 2 }, grade: "중급" },
    { name: "💍 정제된 은반지", type: "ring", stat: { luck: 2 }, grade: "중급" },
    { name: "🎓 지혜의 모자", type: "helmet", stat: { intelligence: 3 }, grade: "중급" },
    { name: "🗡 불꽃의 장검", type: "weapon", stat: { strength: 6 }, grade: "상급" },
    { name: "🛡 용비늘 갑옷", type: "armor", stat: { strength: 5 }, grade: "상급" },
    { name: "🗡 번개의 검", type: "weapon", stat: { strength: 10 }, grade: "희귀" },
    { name: "🛡 천상의 갑옷", type: "armor", stat: { strength: 8 }, grade: "희귀" },
    { name: "🔥 전설의 불멸검", type: "weapon", stat: { strength: 15 }, grade: "전설" },
    { name: "🌟 신의 갑주", type: "armor", stat: { strength: 12 }, grade: "전설" }
  ];

  const rewards = [
    { name: "📺 유튜브 30분 시청", cost: 30 },
    { name: "🎮 게임 30분 하기", cost: 50 },
    { name: "🍰 디저트 먹기", cost: 40 }
  ];

  const estimateDifficulty = (task) => {
    const keywords = {
      청소: 2,
      설거지: 1,
      정리: 1,
      운동: 3,
      보고서: 3,
      발표: 4,
      공부: 2,
      업무: 3,
      회의: 2,
      빨래: 1
    };
    let score = 1;
    for (let key in keywords) {
      if (task.includes(key)) score = Math.max(score, keywords[key]);
    }
    return score;
  };

  const gainXP = (amount) => {
    setPlayer((prev) => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      while (newXP >= 100) {
        newLevel++;
        newXP -= 100;
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const dropLoot = () => {
    const roll = Math.random() * 100;
    let filteredLoot;
    if (roll < 40) filteredLoot = lootTable.filter(i => i.grade === "하급");
    else if (roll < 65) filteredLoot = lootTable.filter(i => i.grade === "중급");
    else if (roll < 85) filteredLoot = lootTable.filter(i => i.grade === "상급");
    else if (roll < 97) filteredLoot = lootTable.filter(i => i.grade === "희귀");
    else filteredLoot = lootTable.filter(i => i.grade === "전설");

    if (filteredLoot.length === 0) return "😢 아이템 없음";
    const item = filteredLoot[Math.floor(Math.random() * filteredLoot.length)];
    setPlayer((prev) => ({ ...prev, inventory: [...prev.inventory, item.name] }));
    return `🎁 아이템 획득! ${item.name}`;
  };

  const handleCompleteTask = (taskName) => {
    const difficulty = estimateDifficulty(taskName);
    const xpGain = difficulty * 10;
    const goldGain = difficulty * 5 + player.stats.luck;
    gainXP(xpGain);
    setPlayer((prev) => ({ ...prev, gold: prev.gold + goldGain }));
    const loot = dropLoot();
    alert(`✅ '${taskName}' 완료!\n📈 XP +${xpGain}, Gold +${goldGain}\n${loot}`);
  };

  const equipItem = (item) => {
    setPlayer((prev) => {
      const slot = item.type;
      const currentEquipped = prev.equipment[slot];
      let newStats = { ...prev.stats };
      if (currentEquipped) {
        const oldItem = lootTable.find((i) => i.name === currentEquipped);
        if (oldItem && oldItem.stat) {
          for (let key in oldItem.stat) {
            newStats[key] -= oldItem.stat[key];
          }
        }
      }
      for (let key in item.stat) {
        newStats[key] += item.stat[key];
      }
      return {
        ...prev,
        stats: newStats,
        equipment: { ...prev.equipment, [slot]: item.name }
      };
    });
  };

  const purchaseReward = (reward) => {
    if (player.gold >= reward.cost) {
      setPlayer((prev) => ({ ...prev, gold: prev.gold - reward.cost }));
      alert(`🎉 '${reward.name}' 사용 가능! 즐겁게 보내세요!`);
    } else {
      alert("😢 골드가 부족합니다!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">🧙‍♂️ 인생 RPG</h1>
      <div>레벨: {player.level} | XP: {player.xp}/100 | 골드: {player.gold}</div>
      <div>스탯: 💪 {player.stats.strength} | 🧠 {player.stats.intelligence} | 🍀 {player.stats.luck}</div>

      <div>
        장비:
        <ul>
          {Object.entries(player.equipment).map(([slot, item]) => (
            <li key={slot}>{slot.toUpperCase()}: {item || "없음"}</li>
          ))}
        </ul>
      </div>

      <div>
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="할 일 입력"
          className="border p-2 w-full"
        />
        <Button onClick={() => {
          if (taskInput.trim()) {
            setTasks([...tasks, taskInput.trim()]);
            setTaskInput("");
          }
        }}>추가</Button>
      </div>

      <div>
        {tasks.map((task, idx) => (
          <motion.div key={idx} className="p-2 border flex justify-between mt-2">
            <span>{task}</span>
            <Button onClick={() => handleCompleteTask(task)}>완료</Button>
          </motion.div>
        ))}
      </div>

      <div>
        인벤토리:
        <ul>
          {player.inventory.length > 0 ? (
            player.inventory.map((itemName, idx) => {
              const item = lootTable.find(i => i.name === itemName);
              const grade = item?.grade || '기타';
              const gradeColor = grade === '하급' ? 'gray' :
                                 grade === '중급' ? 'white' :
                                 grade === '상급' ? 'blue' :
                                 grade === '희귀' ? 'purple' :
                                 grade === '전설' ? 'red' : 'black';
              const sellPrice = grade === '하급' ? 5 :
                                grade === '중급' ? 15 :
                                grade === '상급' ? 40 :
                                grade === '희귀' ? 100 :
                                grade === '전설' ? 250 : 1;
              return (
                <li key={idx} className="flex justify-between">
                  <span style={{ color: gradeColor }}>{itemName}</span>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => item && equipItem(item)}>장착</Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      setPlayer((prev) => ({
                        ...prev,
                        inventory: prev.inventory.filter((_, i) => i !== idx),
                        gold: prev.gold + sellPrice
                      }));
                    }}>판매 (+{sellPrice}G)</Button>
                  </div>
                </li>
              );
            })
          ) : <li>없음</li>}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">🎁 보상 상점</h2>
        <ul>
          {rewards.map((reward, idx) => (
            <li key={idx} className="flex justify-between">
              {reward.name} (💰 {reward.cost})
              <Button size="sm" onClick={() => purchaseReward(reward)}>사용</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
