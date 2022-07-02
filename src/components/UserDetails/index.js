import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFullPageLoader from "../../hooks/useFullPageLoader";

export default function UserDetails() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
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
          // console.log(json);
        });
    };

    getData();
  }, []);
  //console.log(params.id);
  return (
    <>
      <div style={{ padding: "30px 30px 30px 30px" }}>
        <Link to="/">Back</Link>
      </div>
      {data
        .filter((value) => value.id === Number(params.id))
        .map((value) => {
          console.log(value);
          return (
            <div style={{ textAlign: "center" }}>
              <h2>
                Details : {value.first_name} {value.last_name}
              </h2>
              <div>
                First Name:
                <strong>{value.first_name}</strong>
              </div>
              <div>
                Last Name:
                <strong>{value.last_name}</strong>
              </div>
              <div>
                Company Name:
                <strong>{value.company_name}</strong>
              </div>
              <div>
                City:
                <strong>{value.city}</strong>
              </div>
              <div>
                State:
                <strong>{value.state}</strong>
              </div>
              <div>
                Zip:
                <strong>{value.zip}</strong>
              </div>
              <div>
                Email:
                <strong>{value.email}</strong>
              </div>
              <div>
                Website:
                <strong>{value.web}</strong>
              </div>
              <div>
                Age:
                <strong>{value.age}</strong>
              </div>
            </div>
          );
        })}

      {loader}
    </>
  );
}
