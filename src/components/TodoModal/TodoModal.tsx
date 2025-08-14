import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { getUser } from '../../api';
import { User } from '../../types/User';
import { Todo } from '../../types/Todo';

interface Props {
  onClick: () => void;
  todo: Todo | null;
}

export const TodoModal: React.FC<Props> = ({ onClick, todo }) => {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!todo) {
      return;
    }

    const loadUser = async () => {
      try {
        setIsModalLoading(true);
        const loadedUser = await getUser(todo.userId);

        setUser(loadedUser);
      } catch (error) {
        throw new Error('no user data');
      } finally {
        setIsModalLoading(false);
      }
    };

    loadUser();
  }, [todo]);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {isModalLoading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{todo?.id}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onClick}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {todo?.title}
            </p>

            <p className="block" data-cy="modal-user">
              {todo?.completed ? (
                <strong className="has-text-success">Done</strong>
              ) : (
                <strong className="has-text-danger">Planned</strong>
              )}

              {' by '}

              <a href={`mailto:${user?.email}`}>{user?.name}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
