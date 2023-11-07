import { getCurrentUser } from "@/lib/session";
import { UserClient } from "./components/client";

interface SettingPageProps {

}

const SettingPage: React.FC<SettingPageProps> = async ({  }) => {
    const json = await getCurrentUser();
    return (
        <div className="flex-col">
            <div className="container flex-1 space-y-4 p-8 pt-6">
                <UserClient/>
                {/* { json ? (<SettingsForm initialData={json} />) : null} */}
            </div>
        </div>
    );
}

export default SettingPage;
