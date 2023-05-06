import React from 'react';
import { ModalsProvider, ContextModalProps } from '@mantine/modals';
import { useEncounterContext } from '~/components/encounter/EncounterContext';
import { AddCharacterToEncounter } from '~/components/encounter/AddCharacterToEncounter';

const CreateCharacterModal = ({ context, id }: ContextModalProps<{}>) => {
    const encounter = useEncounterContext();
    return <AddCharacterToEncounter encounter={encounter} onSuccess={() => context.closeModal(id)} />;
}

export function EncounterModals({ children }: { children: React.ReactNode }): JSX.Element {
    return (<>
        <ModalsProvider modals={{ addCharacterToEncounter: CreateCharacterModal }}>
            {children}
        </ModalsProvider>
    </>);
}