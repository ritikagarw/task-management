"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import styles from "./page.module.css";
import BasicModal from "@/components/Modal";
import LightToolTip from "@/components/LightToolTip";
import Card from "@/components/Card";
import useSWR from "swr";
import { IconButton } from "@mui/material";
import FilterDialog from "@/components/FilterDialog";
import Image from "next/image";

const Dashboard = () => {
  const router = useRouter();
  const session = useSession();
  const [openFilter, setOpenFilter] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filterValue, setFilterValue] = useState();
  const [filteredTasks, setFilteredTasks] = useState([]);

  //NEW WAY TO FETCH DATA
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
    `/api/tasks?username=${session?.data?.user.email}`,
    fetcher
  );

  useEffect(() => {
    setFilteredTasks(data)
  }, [data])

  useEffect(() => {
    if (filterValue) {
      if (filterValue !== "all" && filterValue !== "dueDate") {
        setFilteredTasks(data.filter((task) => task.status === filterValue));
      } else if (filterValue === "dueDate") {
        setFilteredTasks(
          [...data].sort(
            (objA, objB) => Number(objA.dueDate) - Number(objB.dueDate)
          )
        );
      } else {
        setFilteredTasks(data);
      }
    }
  }, [filterValue]);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "unauthenticated") {
    router?.push("/login");
  }

  const handleClickOpen = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = (value) => {
    setOpenFilter(false);
    setFilterValue(value);
  };

  if (session.status === "authenticated") {
    return (
      <>
        <div className={styles.navbar}>
          <div>Dashboard</div>
          <LightToolTip title="Logout" arrow>
            <IconButton onClick={signOut}>
              <LogoutIcon className={styles.logout} />
            </IconButton>
          </LightToolTip>
        </div>

        <div className={styles.mainBody}>
          {filteredTasks && filteredTasks.length > 0 ? (
            filteredTasks.map((e) => (
              <Card
                key={e._id}
                id={e._id}
                title={e.title}
                desc={e.desc}
                dueDate={e.dueDate}
                status={e.status}
                mutate={mutate}
              />
            ))
          ) : (
            <Image
              src="/addTask.svg"
              alt="me"
              height={0}
              width={0}
              className={styles.svgImage}
            />
          )}
        </div>
        <div className={styles.actionButtons}>
          <LightToolTip title="Filter Task" arrow placement="left">
            <FilterListOutlinedIcon
              sx={{
                fontSize: "3.8rem",
                color: "white",
                backgroundColor: "gray",
                padding: "0.8rem",
                borderRadius: "50%",
              }}
              onClick={handleClickOpen}
            />
          </LightToolTip>

          <LightToolTip title="Add Task" arrow placement="left">
            <AddCircleIcon
              sx={{ fontSize: "4.5rem", color: "#53c28b" }}
              onClick={() => setOpenModal(true)}
            />
          </LightToolTip>
        </div>

        <FilterDialog
          selectedValue={filterValue}
          open={openFilter}
          onClose={handleCloseFilter}
        />

        <BasicModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          heading="Add Task"
          mutate={mutate}
        />
      </>
    );
  }
};

export default Dashboard;
