/*
 * Copyright (c) 2022. TalexDreamSoul
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BaseModel } from '~/plugins/model/BaseModel'

class AssignmentModel extends BaseModel {

  constructor() {
    super("assignments")
  }

  info(id: number) {
    return this._get('detail/' + id)
  }

  list(org_id: number, page: number = 1) {
    return this._post('my/' + org_id + '/' + page, {
      type: 0
    })
  }

  orgList(org_id: number, page: number = 1) {
    return this._get('org/' + org_id + '/' + page)
  }

  create(data: any) {
    return this._post('create', data)
  }

  edit(id: number, data: any) {
    return this._post('edit/' + id, data)
  }

  distributeResult(assignment: number) {
    return this._get('distributes/list/' + assignment)
  }

  distribute(assignment: number, receiver: number[]) {
    return this._post('distribute', { assignment, receiver })
  }

  complete(assignment: number, content: string, attachments: string[]) {
    return this._post('complete/' + assignment, { content, attachments })
  }

  distribution(assignment: number) {
    return this._get('distribution/' + assignment)
  }

  distributionList(assignment: number) {
    return this._get('distributions/' + assignment)
  }

}

export const assignmentModel = new AssignmentModel()
