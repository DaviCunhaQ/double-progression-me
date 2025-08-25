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
import { FaClipboard, FaShareAlt, FaSave } from "react-icons/fa";
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
      setTrainingName("");
      setRestTime("");
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
      setExecName("");
      setExecRestTime("");
      setExecSets("");
    }
  }

  function handleSubmitSetInfo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newInfo || newInfo.info === "") {
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
              index === newInfo.id ? { info: newInfo.info } : set
            ),
          }
        : exec
    );

    setExecData(updatedExecs);
    setIsEditing(null);
    setNewInfo(undefined);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Planejamento de Treino
          </h1>
          <p className="text-gray-600">
            Organize seus treinos de forma simples e eficiente
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaShareAlt className="w-4 h-4" />
            Compartilhar
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaClipboard className="w-4 h-4" />
            Importar
          </button>

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
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FaSave className="w-4 h-4" />
            Salvar
          </button>
        </div>

        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
        <ImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={() => window.location.reload()}
        />

        {/* Add Training Button */}
        <div className="text-center mb-8">
          <button
            onClick={showFormTraining}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto font-semibold text-lg"
          >
            <FaPlus className="w-5 h-5" />
            Adicionar Treino
          </button>
        </div>

        {/* Training Form */}
        {isCreatingTraining && (
          <div className="max-w-md mx-auto mb-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
            >
              <div className="space-y-3">
                <input
                  onChange={(e) => {
                    setTrainingName(e.target.value);
                  }}
                  type="text"
                  placeholder="Nome do Treino"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  onChange={(e) => {
                    setRestTime(e.target.value);
                  }}
                  type="text"
                  placeholder="Descanso entre exercícios"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                >
                  <FaCheck className="w-4 h-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingTraining(false)}
                  className="flex-1 p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
                >
                  <MdCancel className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Training List */}
        {trainingData.length > 0 ? (
          <div className="space-y-6">
            {trainingData.map((training: ITrainingData) => (
              <div
                key={training.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Training Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setIsExecsFromTrainingShowing({
                          id: training.id,
                          state: !(
                            isExecsFromTrainingShowing?.id === training.id &&
                            isExecsFromTrainingShowing?.state
                          ),
                        })
                      }
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-200"
                    >
                      {isExecsFromTrainingShowing?.id === training.id &&
                      isExecsFromTrainingShowing.state ? (
                        <FaArrowUp className="w-4 h-4" />
                      ) : (
                        <FaArrowDown className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {training.name.toUpperCase()}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Descanso: {training.restTime}
                      </p>
                    </div>
                  </div>
                  <button
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
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <FaTrashAlt className="w-4 h-4" />
                  </button>
                </div>

                {/* Add Exercise Form */}
                {isCreatingExec?.id === training.id && isCreatingExec.state ? (
                  <div className="p-6 bg-gray-50">
                    <form onSubmit={handleSubmitExec} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          onChange={(e) => {
                            setExecName(e.target.value);
                          }}
                          type="text"
                          placeholder="Nome do Exercício"
                          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          onChange={(e) => {
                            setExecRestTime(e.target.value);
                          }}
                          type="text"
                          placeholder="Descanso entre séries"
                          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Número de Séries"
                          onChange={(e) => {
                            setExecSets(e.target.value);
                          }}
                          type="number"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setTrainingIdToExec(training.id)}
                          type="submit"
                          className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <FaCheck className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setIsCreatingExec({ id: training.id, state: false })
                          }
                          className="flex-1 p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <MdCancel className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setIsCreatingExec({ id: training.id, state: true })
                    }
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Adicionar Exercício
                  </button>
                )}

                {/* Exercise List */}
                {isExecsFromTrainingShowing?.id === training.id &&
                  isExecsFromTrainingShowing.state && (
                    <div className="p-6 space-y-4">
                      {execData
                        .filter((exec) => exec.trainingId === training.id)
                        .map((exec) => (
                          <div
                            className="bg-gray-50 rounded-xl p-4 space-y-3"
                            key={exec.id}
                          >
                            {/* Exercise Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() =>
                                    setIsSetsFromExecShowing({
                                      id: exec.id,
                                      state: !(
                                        isSetsFromExecShowing?.id === exec.id &&
                                        isSetsFromExecShowing?.state
                                      ),
                                    })
                                  }
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-200"
                                >
                                  {isSetsFromExecShowing?.id === exec.id &&
                                  isSetsFromExecShowing.state ? (
                                    <FaArrowUp className="w-4 h-4" />
                                  ) : (
                                    <FaArrowDown className="w-4 h-4" />
                                  )}
                                </button>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {exec.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    Descanso: {exec.rest}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const newExecs = execData.filter(
                                    (execData) => execData.id !== exec.id
                                  );
                                  setExecData(newExecs);
                                }}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <FaTrashAlt className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Sets List */}
                            {isSetsFromExecShowing?.id === exec.id &&
                              isSetsFromExecShowing.state && (
                                <div className="ml-8 space-y-2">
                                  {exec.setsData.map((set, index) => (
                                    <form
                                      onSubmit={handleSubmitSetInfo}
                                      className="flex items-center gap-3 p-3 bg-white rounded-lg"
                                      key={index}
                                    >
                                      <span className="text-gray-500 font-medium">
                                        Série {index + 1}
                                      </span>
                                      <input
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        onChange={(e) => {
                                          setNewInfo({
                                            id: index,
                                            info: e.target.value,
                                          });
                                        }}
                                        type="text"
                                        placeholder={set.info}
                                        value={
                                          isEditing?.id === index &&
                                          isEditing?.execId === exec.id &&
                                          isEditing?.state
                                            ? newInfo?.info || set.info
                                            : set.info
                                        }
                                        disabled={
                                          !(
                                            isEditing?.id === index &&
                                            isEditing?.execId === exec.id &&
                                            isEditing?.state
                                          )
                                        }
                                      />
                                      {isEditing?.id === index &&
                                      isEditing?.execId === exec.id &&
                                      isEditing?.state ? (
                                        <button
                                          type="submit"
                                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                                        >
                                          <FaCheck className="w-3 h-3" />
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setIsEditing({
                                              state: true,
                                              id: index,
                                              execId: exec.id,
                                            })
                                          }
                                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                                        >
                                          Editar
                                        </button>
                                      )}
                                    </form>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum Treino Cadastrado
              </h3>
              <p className="text-gray-600">
                Comece criando seu primeiro treino!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
