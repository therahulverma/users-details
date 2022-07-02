import "./App.css";
import { TableHeader, Pagination, Search } from "./components/DataTable";
import useFullPageLoader from "./hooks/useFullPageLoader";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const ITEMS_PER_PAGE = 50;

  const headers = [
    { name: "First Name", field: "first_name", sortable: true },
    { name: "Last Name", field: "last_name", sortable: true },
    { name: "Age", field: "age", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "WebSite", field: "web", sortable: true },
  ];

  useEffect(() => {
    const getData = () => {
      showLoader();

      fetch(
        "https://datapeace-storage.s3-us-west-2.amazonaws.com/dummy_data/users.json"
      )
        .then((response) => response.json())
        .then((json) => {
          hideLoader();
          setData(json);
          console.log(json);
        });
    };

    getData();
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = data;

    if (search) {
      computedComments = computedComments.filter(
        (value) =>
          value.first_name.toLowerCase().includes(search.toLowerCase()) ||
          value.last_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedComments.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedComments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [data, currentPage, search, sorting]);

  const navigate = useNavigate();

  return (
    <>
      <div className="row w-100">
        <div className="col mb-3 col-12 text-center">
          <div className="row">
            <div className="col-md-6 d-flex flex-row-reverse">
              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <table className="table">
            <TableHeader
              headers={headers}
              onSorting={(field, order) => setSorting({ field, order })}
            />
            <tbody>
              {commentsData.map((value) => (
                <tr>
                  <td>
                    <Link to={`/users/${value.id}`}>{value.first_name}</Link>
                  </td>
                  <td>{value.last_name}</td>
                  <td>{value.age}</td>
                  <td>{value.email}</td>
                  <td>
                    <a href={value.web} target="_blank">
                      {value.web}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="col-md-6">
            <Pagination
              total={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      {loader}
    </>
  );
}

export default App;
