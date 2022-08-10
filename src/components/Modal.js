import React from "react";
import { Link } from "react-router-dom";

function Modal({ option, closeModal, followDetails }) {
  return (
    <>
      <div className='modal-container d-flex justify-center' id='foll-modal'>
        <div className='modal f-modal'>
          <h1>{option === "followers" ? "Followers" : "Following"}</h1>
          <div className='f-user-container d-flex flex-col'>
            {React.Children.toArray(
              followDetails.map((user) => {
                return (
                  <>
                    <Link
                      to={
                        option === "followers"
                          ? `/user/${user.follower_id}`
                          : `/user/${user.following_id}`
                      }
                      style={{ color: "#000" }}>
                      <div className='f-user d-flex align-center'>
                        <h1>
                          {option === "followers"
                            ? user.follower_name
                            : user.following_name}
                        </h1>
                      </div>
                    </Link>
                    <hr />
                  </>
                );
              })
            )}
          </div>

          <button
            className='modal-close'
            style={{ marginTop: "20px", backgroundColor: "red" }}
            onClick={() => closeModal(false)}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default Modal;
