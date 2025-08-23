import { useEffect, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Slide, toast } from "react-toastify";
import { FaClipboard, FaShareAlt } from "react-icons/fa";
import ShareModal from "./components/ShareModal";
import ImportModal from "./components/ImportModal";

interface IExecData {
  id: number;
  name: string;
  rest: string;
  trainingId: number;
  setsData: { info: string }[];
}

interface ITrainingData {
  id: number;
  name: string;
  restTime: string;
}

function App() {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [trainingData, setTrainingData] = useState<ITrainingData[]>([]);
  const [execData, setExecData] = useState<IExecData[]>([]);
  const [trainingName, setTrainingName] = useState("");
  const [restTime, setRestTime] = useState("");
  const [isCreatingTraining, setIsCreatingTraining] = useState(false);
  const [isCreatingExec, setIsCreatingExec] = useState<{
    id: number;
    state: boolean;
  } | null>(null);
  const [execName, setExecName] = useState("");
  const [execRestTime, setExecRestTime] = useState("");
  const [execSets, setExecSets] = useState("");
  const [trainingIdToExec, setTrainingIdToExec] = useState(0);
  const [isEditing, setIsEditing] = useState<{
    state: boolean;
    id: number;
    execId: number;
  } | null>(null);
  const [newInfo, setNewInfo] = useState<{ id: number; info: string }>();
  const [isSetsFromExecShowing, setIsSetsFromExecShowing] = useState<{
    id: number;
    state: boolean;
  } | null>(null);
  const [isExecsFromTrainingShowing, setIsExecsFromTrainingShowing] = useState<{
    id: number;
    state: boolean;
  } | null>(null);
  useEffect(() => {
    const data = localStorage.getItem("finalData");
    if (data) {
      setTrainingData(JSON.parse(data).trainingData);
      setExecData(JSON.parse(data).execData);
    }
  }, []);
  function showFormTraining() {
    setIsCreatingTraining(true);
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trainingName === "" || restTime === "") {
      toast.error("Preencha todos os campos!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    } else {
      const data = {
        id: trainingData.length + 1,
        name: trainingName,
        restTime: restTime,
      };
      const newTrainings = trainingData.concat(data);
      setTrainingData(newTrainings);
      setIsCreatingTraining(false);
      setIsExecsFromTrainingShowing({ id: data.id, state: true });
    }
  }

  function handleSubmitExec(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (execName === "" || execRestTime === "" || execSets === "") {
      toast.error("Preencha todos os campos!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    } else {
      const data = {
        id: execData.length + 1,
        name: execName,
        rest: execRestTime,
        trainingId: trainingIdToExec,
        setsData:
          Number(execSets) > 0
            ? Array.from({ length: Number(execSets) }, () => ({
                info: `ex:8 reps 100kg rir2`,
              }))
            : [],
      };
      const newExecs = execData.concat(data);
      setExecData(newExecs);
      setIsCreatingExec({ id: trainingIdToExec, state: false });
    }
  }

  function handleSubmitSetInfo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newInfo?.info === "") {
      toast.error("Preencha o campo!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      return;
    }

    const updatedExecs = execData.map((exec) =>
      exec.id === isEditing?.execId
        ? {
            ...exec,
            setsData: exec.setsData.map((set, index) =>
              index === newInfo?.id ? { info: newInfo.info } : set
            ),
          }
        : exec
    );

    setExecData(updatedExecs);
    setIsEditing(null);
  }

  return (
    <div className="flex flex-col items-center h-screen py-8">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsShareOpen(true)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
        >
          <FaShareAlt /> Compartilhar
        </button>

        <button
          onClick={() => setIsImportOpen(true)}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
        >
          <FaClipboard /> Importar
        </button>
      </div>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={() => window.location.reload()}
      />
      <button
        type="button"
        onClick={() => {
          const data = {
            trainingData: trainingData,
            execData: execData,
          };
          localStorage.setItem("finalData", JSON.stringify(data));
          toast.success("Planejamento salvo com sucesso!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          });
        }}
        className="p-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 mb-4"
      >
        SALVAR PLANEJAMENTO
      </button>
      <button
        onClick={showFormTraining}
        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
      >
        Adicionar Treino
      </button>
      {isCreatingTraining && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center mt-4 w-[21.875rem] gap-2 p-2 border border-black rounded-md"
        >
          <div className="w-full flex flex-col gap-2 items-center justify-center">
            <input
              onChange={(e) => {
                setTrainingName(e.target.value);
              }}
              type="text"
              placeholder="Nome do Treino"
              className="p-2 border border-black rounded-md w-full"
            />
            <input
              onChange={(e) => {
                setRestTime(e.target.value);
              }}
              type="text"
              placeholder="Descanso entre exercícios"
              className="p-2 border border-black rounded-md w-full"
            />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
            >
              <FaCheck />
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingTraining(false)}
              className="p-2 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600"
            >
              <MdCancel />
            </button>
          </div>
        </form>
      )}
      {trainingData.length > 0 ? (
        <>
          {trainingData.map((training: ITrainingData) => (
            <>
              <div
                className="flex justify-between items-center w-[21.875rem] p-2 border border-black rounded-t-md mt-4"
                key={training.id}
              >
                {isExecsFromTrainingShowing?.id === training.id &&
                isExecsFromTrainingShowing.state ? (
                  <FaArrowUp
                    onClick={() =>
                      setIsExecsFromTrainingShowing({
                        id: training.id,
                        state: false,
                      })
                    }
                  />
                ) : (
                  <FaArrowDown
                    onClick={() =>
                      setIsExecsFromTrainingShowing({
                        id: training.id,
                        state: true,
                      })
                    }
                  />
                )}
                <div className="flex flex-col gap-2 items-center justify-center">
                  <h1 className="text-xl font-bold">
                    {training.name.toUpperCase()}
                  </h1>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <p>descanso:</p>
                  <p>{training.restTime}</p>
                </div>
                <FaTrashAlt
                  className="bg-red"
                  onClick={() => {
                    const newTrainings = trainingData.filter(
                      (trainingData) => trainingData.id !== training.id
                    );
                    const newExecs = execData.filter(
                      (execData) => execData.trainingId !== training.id
                    );
                    setExecData(newExecs);
                    setTrainingData(newTrainings);
                  }}
                />
              </div>
              {isCreatingExec?.id === training.id && isCreatingExec.state ? (
                <form
                  onSubmit={handleSubmitExec}
                  className="flex items-center w-[21.875rem] gap-2 p-2 border border-black rounded-b-md"
                >
                  <div className="w-full flex flex-col gap-2 items-center justify-center">
                    <input
                      onChange={(e) => {
                        setExecName(e.target.value);
                      }}
                      type="text"
                      placeholder="Nome do Exercício"
                      className="p-2 border border-black rounded-md w-full"
                    />
                    <input
                      onChange={(e) => {
                        setExecRestTime(e.target.value);
                      }}
                      type="text"
                      placeholder="Descanso entre séries"
                      className="p-2 border border-black rounded-md w-full"
                    />
                    <input
                      className="border p-2 rounded-md w-full"
                      placeholder="Séries"
                      onChange={(e) => {
                        setExecSets(e.target.value);
                      }}
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <button
                      onClick={() => setTrainingIdToExec(training.id)}
                      type="submit"
                      className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                    >
                      <FaCheck />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setIsCreatingExec({ id: training.id, state: false })
                      }
                      className="p-2 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600"
                    >
                      <MdCancel />
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  onClick={() =>
                    setIsCreatingExec({ id: training.id, state: true })
                  }
                  className="flex gap-2 w-[21.875rem] p-2 rounded-b-md border border-black bg-blue-500 text-white justify-center items-center font-bold"
                >
                  <h1>Adicionar Exercício </h1>
                  <FaPlus />
                </div>
              )}
              {isExecsFromTrainingShowing?.id === training.id &&
                isExecsFromTrainingShowing.state && (
                  <div className="mt-4 flex flex-col gap-2 w-[21.875rem]">
                    {execData
                      .filter((exec) => exec.trainingId === training.id)
                      .map((exec) => (
                        <div
                          className="flex flex-col gap-2 w-full"
                          key={exec.id}
                        >
                          <div
                            className="flex items-center justify-between w-[18.75rem] p-2 border border-black rounded-md"
                            key={exec.id}
                          >
                            {isSetsFromExecShowing?.id === exec.id &&
                            isSetsFromExecShowing.state ? (
                              <FaArrowUp
                                onClick={() =>
                                  setIsSetsFromExecShowing({
                                    id: exec.id,
                                    state: false,
                                  })
                                }
                              />
                            ) : (
                              <FaArrowDown
                                onClick={() =>
                                  setIsSetsFromExecShowing({
                                    id: exec.id,
                                    state: true,
                                  })
                                }
                              />
                            )}
                            <p>{exec.name}</p>
                            <p>{exec.rest}</p>
                            <FaTrashAlt
                              onClick={() => {
                                const newExecs = execData.filter(
                                  (execData) => execData.id !== exec.id
                                );
                                setExecData(newExecs);
                              }}
                            />
                          </div>
                          {isSetsFromExecShowing?.id === exec.id &&
                            isSetsFromExecShowing.state && (
                              <div className="flex flex-col gap-2 w-full">
                                {exec.setsData.map((set, index) => (
                                  <form
                                    onSubmit={handleSubmitSetInfo}
                                    className="flex items-center w-[18.75rem] p-2 gap-8"
                                    key={index}
                                  >
                                    <p>{">"}</p>
                                    <input
                                      className="p-2 border border-black rounded-md"
                                      onChange={(e) => {
                                        setNewInfo({
                                          id: index,
                                          info: e.target.value,
                                        });
                                      }}
                                      type="text"
                                      placeholder={set.info}
                                      disabled={
                                        isEditing?.id === index
                                          ? !isEditing.state
                                          : true
                                      }
                                    />
                                    {(
                                      isEditing?.id === index &&
                                      isEditing.execId === exec.id
                                        ? isEditing.state
                                        : false
                                    ) ? (
                                      <button type="submit">
                                        <p className="underline text-blue-500">
                                          Ok
                                        </p>
                                      </button>
                                    ) : (
                                      <p
                                        className="underline text-blue-500"
                                        onClick={() =>
                                          setIsEditing({
                                            state: true,
                                            id: index,
                                            execId: exec.id,
                                          })
                                        }
                                      >
                                        Editar
                                      </p>
                                    )}
                                  </form>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                )}
            </>
          ))}
        </>
      ) : (
        <>
          <p className="mt-4">Nenhum Treino Cadastrado ;(</p>
        </>
      )}
    </div>
  );
}

export default App;
