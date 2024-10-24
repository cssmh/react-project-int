import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Courses = () => {
  // Fetch data from API using React Query
  const { data = [], isLoading } = useQuery({
    queryKey: ["allCourse"],
    queryFn: async () => {
      const res = await axios.get("https://itder.com/api/get-course-list");
      return res?.data?.courseData;
    },
  });
  console.log(data)

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((course) => {
          const regularPrice = parseFloat(course.regular_price);
          const discountPrice = parseFloat(course.discount_price);
          const discountPercentage = (
            ((regularPrice - discountPrice) / regularPrice) *
            100
          ).toFixed(2);

          return (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img src={course?.photo} className="w-[200px] h-[250px] mx-auto" alt={course.course_name} />
                <div className="absolute top-0 left-0 p-2">
                  <h3 className="text-white text-xl font-bold">
                    {course.course_name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-gray-800 text-lg font-semibold mb-2">
                  {course.course_name}
                </h2>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex text-blue-500 text-md">
                    ★★★★★ 
                    {/* (no need to change) */}
                  </span>
                  <span className="ml-2 text-gray-600 text-md font-bold">
                    {course.trainer_data?.name || "Unknown Trainer"}
                  </span>
                </div>
                <p className="text-gray-600 text-md mb-4">
                  Course Details{" "}
                  <span className="text-blue-500">
                    Show Details (no need to change)
                  </span>
                </p>
                <hr />
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="line-through text-gray-400 text-sm">
                      Tk {regularPrice}
                    </span>
                    <span className="text-green-600 text-md font-bold ml-2">
                      -{discountPercentage}%
                    </span>
                    <span className="text-black text-lg font-bold ml-2">
                      Tk {discountPrice}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full font-bold text-md">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
