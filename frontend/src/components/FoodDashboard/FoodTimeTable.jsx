import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";


const initialFoodData = {};

const FoodTimeTable = () => {
  const navigate = useNavigate();
  const {user} = useUser()
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [foodData, setFoodData] = useState(initialFoodData);

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState("");
  const [currentFood, setCurrentFood] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    fats: "",
    protein: "",
    sugars: "",
  });

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-food");
      const groupedData = response.data.reduce((acc, item) => {
        const { day, mealType, _id, name, calories, fats, protein, sugars } =
          item;

        if (!acc[day]) acc[day] = {};
        if (!acc[day][mealType]) acc[day][mealType] = [];

        name.forEach((foodName, index) => {
          acc[day][mealType].push({
            id: _id,
            name: foodName,
            calories: calories[index] || 0,
            fats: fats[index] || 0,
            protein: protein[index] || 0,
            sugars: sugars[index] || 0,
          });
        });

        return acc;
      }, {});

      setFoodData(groupedData);
    } catch (error) {
      console.error("Error fetching food data from server", error);
    }
  };

  const handleDayChange = (day) => setSelectedDay(day);

  const openAddPopup = (mealType = "") => {
    setCurrentMealType(mealType);
    setFormData({
      day:"",
      mealType:"",
      name: "",
      calories: "",
      fats: "",
      protein: "",
      sugars: "",
    });
    setIsAddPopupOpen(true);
  };

  const openUpdatePopup = (mealType, food) => {
    setCurrentMealType(mealType);
    setCurrentFood(food);
    setFormData({ ...food });
    setIsUpdatePopupOpen(true);
  };

  const closeAddPopup = () => setIsAddPopupOpen(false);
  const closeUpdatePopup = () => setIsUpdatePopupOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFood = async () => {
    try {
      const payloadToSend = {
        day: formData.day,
        mealType: formData.mealType,
        name: formData.name,
        calories: parseInt(formData.calories, 10),
        fats: parseInt(formData.fats, 10),
        protein: parseInt(formData.protein, 10),
        sugars: parseInt(formData.sugars, 10),
      };

      console.log("Sending payload to server:", payloadToSend);

      await axios.put(
        `http://localhost:5000/api/add-update-food`,
        payloadToSend
      );

      fetchFoodData();
      closeAddPopup();
    } catch (error) {
      console.error("Error sending food data:", error.response || error);
    }
  };






  const handleUpdateFood = async () => {
    try {
      const updatedFood = {
        name: [formData.name],
        calories: [parseInt(formData.calories, 10)],
        fats: [parseInt(formData.fats, 10)],
        protein: [parseInt(formData.protein, 10)],
        sugars: [parseInt(formData.sugars, 10)],
      };

      await axios.put(
        `http://localhost:5000/api/update-food/${currentFood.id}`,
        updatedFood
      );

      fetchFoodData();
      closeUpdatePopup();
    } catch (error) {
      console.error("Error updating food:", error);
    }
  };

 const removeFood = (mealType, id) => {
   setFoodData((prevData) => ({
     ...prevData,
     [selectedDay]: {
       ...prevData[selectedDay],
       [mealType]: prevData[selectedDay][mealType].filter(
         (item) => item.id !== id
       ),
     },
   }));
 };


  const renderMealSection = (mealType, mealName) => {
    const mealData = foodData[selectedDay]?.[mealType] || [];

    return (
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">{mealName}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                {[
                  "Food",
                  "Calories",
                  "Fats",
                  "Protein",
                  "Sugars",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border px-3 py-2 text-sm font-medium text-gray-600 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealData.length > 0 ? (
                mealData.map((food) => (
                  <tr key={food.id} className="border-b hover:bg-blue-50">
                    <td className="border px-3 py-2 text-gray-700">
                      {food.name}
                    </td>
                    <td className="border px-3 py-2 text-gray-600">
                      {food.calories}
                    </td>
                    <td className="border px-3 py-2 text-gray-600">
                      {food.fats}
                    </td>
                    <td className="border px-3 py-2 text-gray-600">
                      {food.protein}
                    </td>
                    <td className="border px-3 py-2 text-gray-600">
                      {food.sugars}
                    </td>
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => openUpdatePopup(mealType, food)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => removeFood(mealType, food.id)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-3 py-2 text-center text-gray-500 text-sm"
                  >
                    No food items for this meal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Weekly Food TimeTable
        </h1>
        {user.id}
        <button className="bg-gray-600 px-4 py-1 rounded-lg text-white" onClick={()=> navigate("/fooddashboard")}>Back</button>
        {/* Buttons for days and add food */}
        <div className="flex justify-center space-x-2 mb-4">
          {Object.keys(foodData).map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedDay === day
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {day}
            </button>
          ))}
          <button
            onClick={() => openAddPopup()}
            className="py-2 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            Add Food
          </button>
        </div>

        {/* Render meal data */}
        {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) =>
          renderMealSection(meal, meal)
        )}
      </div>

      {/* Add Popup Modal */}
      {isAddPopupOpen && (
        <PopupAdd
          title="Add Food"
          formData={formData}
          onClose={closeAddPopup}
          onChange={handleFormChange}
          onSubmit={handleAddFood}
        />
      )}

      {/* Update Popup Modal */}
      {isUpdatePopupOpen && (
        <PopupUpdate
          title="Update Food"
          formData={formData}
          onClose={closeUpdatePopup}
          onChange={handleFormChange}
          onSubmit={handleUpdateFood}
        />
      )}
    </div>
  );
};

const PopupUpdate = ({ title, formData, onClose, onChange, onSubmit }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form>
        {["name", "calories", "fats", "protein", "sugars"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={onChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="py-2 px-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
);

const PopupAdd = ({
  title,
  formData,
  onClose,
  onChange,
  onSubmit,
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"],
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form>
          {/* Day Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
              name="day"
              value={formData.day}
              onChange={onChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="" disabled>Select a day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Meal Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={onChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="" disabled>Select a meal type</option>
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Input fields in Grid for Better Responsive UI */}
          <div className="grid grid-cols-2 gap-4">
            {["name", "calories", "fats", "protein", "sugars"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={onChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="py-2 px-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};





export default FoodTimeTable;
