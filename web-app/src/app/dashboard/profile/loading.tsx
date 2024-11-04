import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Profile_Loading() {
    return (
        <div className="flex flex-grow items-center justify-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 my-12" />
        </div>
    );
}
