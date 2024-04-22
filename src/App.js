import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Profile from "./Profile";
import "./index.css";


function App() {
  const [items, setItems] = useState([]);
  const [users] = useState("eberechukss");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 

  useEffect(() => {
    const fetchRepos = async () => {
      const res = await fetch(
        `https://api.github.com/users/${users}/repos?page=1&per_page=17&sort=updated`
      );
      const data = await res.json();
      setItems(data);
    };

    fetchRepos();
  }, [users]);

  useEffect(() => {
    // Filter items based on search term
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // To test the error boundary functionality uncomment
  // if (items.length === 0) {
  //   throw new Error('Failed to fetch data');
  // }

  // Modal state for creating new repository
  const [newRepoModalOpen, setNewRepoModalOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");

  // Function to handle creating a new repository
  const handleCreateRepo = async () => {
    try {
      const res = await fetch(`https://api.github.com/user/repos`, {
        method: "POST",
        headers: {
          Authorization: `token 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRepoName }),
      });
      const data = await res.json();
      // Add the newly created repository to the items state
      setItems([data, ...items]);
      setNewRepoName("");
      setNewRepoModalOpen(false);
    } catch (error) {
      console.error("Error creating repository:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  // Modal state for updating repository details
  const [updateRepoModalOpen, setUpdateRepoModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [updatedRepoName, setUpdatedRepoName] = useState("");

  // Function to handle updating repository details
  const handleUpdateRepo = async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${selectedRepo.full_name}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token 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`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedRepoName }),
        }
      );
      const data = await res.json();
      // Update the repository name in the items state
      const updatedItems = items.map((item) =>
        item.id === selectedRepo.id ? data : item
      );
      setItems(updatedItems);
      setUpdatedRepoName("");
      setUpdateRepoModalOpen(false);
    } catch (error) {
      console.error("Error updating repository:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  // Function to delete a repository
  const handleDeleteRepo = async (repoId) => {
    try {
      await fetch(`https://api.github.com/repos/${repoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `token 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`,
        },
      });
      // Remove the deleted repository from the items state
      const updatedItems = items.filter((item) => item.id !== repoId);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting repository:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  return (
    <>
      {!items ? (
        <Loading />
      ) : (
        <>
          <section className="pt-20 pb-20">
            <h1 className="text-2xl font-bold">
              Viewing {users}'s repositories
            </h1>
            {/* Search input field */}
            <div className="flex justify-start mt-4 mb-4">
              <input
                type="text"
                placeholder="Search repositories"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md p-2 mr-4 w-full" // Adjusted width
              />
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 pt-4">
              {currentItems.map((item) => (
                <Profile
                  key={item.id}
                  {...item}
                  onDelete={() => handleDeleteRepo(item.id)}
                />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {[
                ...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys(),
              ].map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 py-1 mx-1 rounded-full ${
                    currentPage === number + 1
                      ? "bg-gray-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            {/* Button to create a new repository */}
            <button
              onClick={() => setNewRepoModalOpen(true)}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-pink-600"
            >
              Create New Repository
            </button>
            {/* New Repository Modal */}
            {newRepoModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg w-1/3">
                  <h2 className="text-xl font-bold mb-4">
                    Create New Repository
                  </h2>
                  <input
                    type="text"
                    placeholder="Repository Name"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    className="border border-pink-300 rounded-md p-2 mb-4 w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setNewRepoModalOpen(false)}
                      className="px-4 py-2 bg-purple-300 text-gray-800 rounded mr-2 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateRepo}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-pink-600"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Update Repository Modal */}
            {updateRepoModalOpen && selectedRepo && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg w-1/3">
                  <h2 className="text-xl font-bold mb-4">Update Repository</h2>
                  <input
                    type="text"
                    placeholder="Repository Name"
                    value={updatedRepoName}
                    onChange={(e) => setUpdatedRepoName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setUpdateRepoModalOpen(false)}
                      className="px-4 py-2 bg-purple-300 text-gray-800 rounded mr-2 hover:bg-pink-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateRepo}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-pink-600"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default App;
