import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loader from "../../Utils/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { FaRegImage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import NewGalleryModal from "./NewGalleryModal";
import UpdateGalleryModal from "./UpdateGalleryModal";
import Loader2 from "../../Utils/Loader/Loader2";

const GalleryList = () => {
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [id, setId] = useState(null);
  const [loader, setLoader] = useState(false)
  const [data, setData] = useState(null)
  const imgUrl = `https://littleaccount.com/uploads/gallery/`

  const { isLoading, refetch } = useQuery({
    queryKey: ["gallery_list"],
    queryFn: async () => {
      const res = await axiosSecure("/api/gallery");
      setData(res.data);
    },
  });

  // const handleActiveInactive = async (id, status) => {
  //   if (status === 1) {
  //     try {
  //       const res = await axiosSecure(`/api/inactive-single-member/${id}`);
  //       if (res.data.status_code === 201) {
  //         toast.success("Inactivated Successfully");
  //         refetch();
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   } else {
  //     try {
  //       const res = await axiosSecure(`/api/active-single-member/${id}`);
  //       if (res.data.status_code === 201) {
  //         toast.success("Activated Successfully");
  //         refetch();
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //     }
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const res = await axiosSecure.delete(`/api/gallery-delete/${id}`);
      if (res.data) {
        toast.success("Photo Deleted Successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateMember = (data) => {
    setId(data)
    setIsUpdateOpen(true)
  }

  const onPageChange = async(url) => {
    try {
      const res = await axiosSecure(url)
      if(res.data){
        setData(res.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  if (isLoading && !data) {
    return <Loader />;
  }


  return (
    <div className="mx-2 my-4 space-y-2 relative">
      {loader && <Loader2 />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 bg-bg_slate mb-2 w-full ">
          <div className="flex">
            <button
              className={`bg-text_sidebar text-black px-6 h-[40px] font-bold duration-500`}
            >
              All Image ( {data?.allGalleryCount || 0} )
            </button>
          </div>
          <Link
          onClick={() => setIsOpen(true)}
            className={`bg-text_sidebar text-black px-6 h-[40px] font-bold duration-500 flex items-center hover:bg-bg_slate hover:text-_white justify-center`}
          >
            New Image
          </Link>
        </div>
      </div>

      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gap_primary text-center">
          {data.galleryData.data.map((data) => (
            <div
              key={data.id}
              className="bg-_white border-2 border-bg_lightSlate rounded-md p-[20px] mx-auto w-full"
            >
              <div>
                <div className="h-60 w-full overflow-hidden">
                  {data.image ? <img
                    src={`${imgUrl}${data.image}`}
                    className="h-full w-full object-cover"
                    alt=""
                  /> : 
                  <FaRegImage className="h-full w-full object-cover" />}
                </div>
                <div className="mt-2">
                  <p className="mb-2 text-gray-500 text-center">
                    <strong>{data.title}</strong>
                  </p>
                  <hr />
                  <div className="flex gap-2">
                    <button 
                    onClick={() => updateMember(data)} 
                    className="button_primary mt-4 w-full">Edit</button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="button_delete mt-4 w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center space-x-2 my-4">
            {/* Previous Button */}
            <button
                onClick={() => data.galleryData.prev_page_url && onPageChange(data.galleryData.prev_page_url)}
                className={`px-4 py-2 border rounded ${!data.galleryData.prev_page_url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                // disabled={!prev_page_url}
            >
                &laquo; Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1 flex-wrap">
            {data.galleryData.links?.map((link, index) => (
                <button
                    key={index}
                    onClick={() => link.url && onPageChange(link.url)}
                    className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                    disabled={!link.url}
                >
                    {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                </button>
            ))}
            </div>
            {/* Next Button */}
            <button
                onClick={() => data.galleryData.next_page_url && onPageChange(data.galleryData.next_page_url)}
                className={`px-4 py-2 border rounded ${!data.galleryData.next_page_url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                disabled={!data.galleryData.next_page_url}
            >
                Next &raquo;
            </button>
        </div>
      <UpdateGalleryModal setLoader={setLoader} isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} id={id} fetchData={refetch} />
      <NewGalleryModal setLoader={setLoader} isOpen={isOpen} setIsOpen={setIsOpen} fetchData={refetch} />
    </div>
  );
};

export default GalleryList;